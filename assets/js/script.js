const timeWidget = () => {
  const dateWidget = document.getElementById("dateWidget");
  const timeWidget = document.getElementById("timeWidget");

  const updateTime = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateWidget.textContent = today.toLocaleDateString("id-ID", options);
    timeWidget.textContent = today.toLocaleTimeString("id-ID", {
      hour12: false,
    });
  };

  updateTime();
  const intervalId = setInterval(updateTime, 1000);
  return () => clearInterval(intervalId);
};

const formModalTodo = () => {
  const modal = document.getElementById("formModal");
  const btnModal = document.getElementById("btnModal");
  const btnClose = document.querySelector(".close");

  btnModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

const updatePriorityCounts = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  console.log(todos);
  const lowCount = todos.filter((todo) => todo.priority === "low").length;
  const mediumCount = todos.filter((todo) => todo.priority === "medium").length;
  const highCount = todos.filter((todo) => todo.priority === "high").length;

  const lowCountElement = document.getElementById("lowCount");
  const mediumCountElement = (document.getElementById(
    "mediumCount"
  ).textContent = mediumCount);
  const highCountElement = (document.getElementById("highCount").textContent =
    highCount);
  lowCountElement.textContent = lowCount;
  mediumCountElement.textContent = mediumCount;
  highCountElement.textContent = highCount;
};

const createTodoCard = (todo) => {
  const card = document.createElement("div");
  card.classList.add("card-todo");
  card.setAttribute("data-index", todo.id);
  card.innerHTML = `
    <div class="card-content">
      <p class="card-todo-desc" style="${
        todo.status === "done" ? "text-decoration: line-through;" : ""
      }">${todo.todo}</p>
    </div>
    <div class="card-todo-footer">
      <span class="card-todo-time">${todo.date}</span>
      <span class="card-todo-priority priority-${todo.priority}">${
    todo.priority
  }</span>
      <button class="card-todo-delete" aria-label="Delete Task"><i class="fa-solid fa-trash"></i></button>
      <input type="checkbox" class="card-todo-checkbox" ${
        todo.status === "done" ? "checked" : ""
      } aria-label="Mark task as ${todo.status === "done" ? "undone" : "done"}">
    </div>
  `;
  return card;
};

const addTodo = (e) => {
  e.preventDefault();

  const todoList = document.getElementById("todoList");
  const todo = document.getElementById("inputTodo").value.trim();
  const priority = document.getElementById("inputPriority").value;
  const date = document.getElementById("inputDate").value;

  if (!todo || !priority || !date) {
    const errors = [];
    if (!todo) errors.push("Kegiatan is required");
    if (!priority) errors.push("Priority is required");
    if (!date) errors.push("Date is required");
    alert(errors.join("\n"));
    return;
  }

  const dataTodo = {
    id: Date.now(),
    todo: todo,
    date,
    priority: priority,
    status: "todo",
  };

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(dataTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  todoList.innerHTML = "";

  document.getElementById("inputTodo").value = "";
  document.getElementById("inputPriority").value = "";
  document.getElementById("inputDate").value = "";

  loadTodoList();
  updatePriorityCounts();
};

let currentDateFilter = null;
const loadTodoList = () => {
  const todoList = document.getElementById("todoList");

  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  let filteredTodos = todos.filter((todo) => todo.status === "todo");

  if (currentDateFilter) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.date === currentDateFilter
    );
  }

  todoList.innerHTML = "";

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<p class="emptyData">Tidak ada data</p>`;
  } else {
    filteredTodos.forEach((todo) => {
      if (todo.status === "todo") {
        const card = createTodoCard(todo);
        todoList.appendChild(card);
        const deleteBtn = card.querySelector(".card-todo-delete");
        deleteBtn.addEventListener("click", () => {
          deleteTodo(todo.id);
          updatePriorityCounts();
        });
      }
    });
  }

  todoList.removeEventListener("change", handleCheckboxChange);
  todoList.addEventListener("change", handleCheckboxChange);
};

const loadDoneList = () => {
  const doneList = document.getElementById("doneList");

  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  let doneItems = todos.filter((todo) => todo.status === "done");

  if (currentDateFilter) {
    doneItems = doneItems.filter((todo) => todo.date === currentDateFilter);
  }

  doneList.innerHTML = "";

  if (doneItems.length === 0) {
    doneList.innerHTML = `<p class="emptyData">Tidak ada data</p>`;
  } else {
    doneItems.forEach((todo) => {
      const card = createTodoCard(todo);
      doneList.appendChild(card);
      const deleteBtn = card.querySelector(".card-todo-delete");
      deleteBtn.addEventListener("click", () => {
        deleteTodo(todo.id);
        updatePriorityCounts();
      });
    });
  }

  doneList.removeEventListener("change", handleCheckboxChange);
  doneList.addEventListener("change", handleCheckboxChange);
};

const handleAddTodo = () => {
  const todoForm = document.getElementById("todoForm");
  todoForm.addEventListener("submit", (e) => addTodo(e));
};

const handleCheckboxChange = (e) => {
  if (e.target && e.target.matches(".card-todo-checkbox")) {
    const checkbox = e.target;
    const todoCard = checkbox.closest(".card-todo");
    const index = parseInt(todoCard.getAttribute("data-index"), 10);
    const lineThrough = todoCard.querySelector(".card-todo-desc");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    const todoIndex = todos.findIndex((todo) => todo.id === index);
    console.log(todoIndex);

    if (todoIndex !== -1) {
      if (checkbox.checked) {
        todos[todoIndex].status = "done";
        lineThrough.style.textDecoration = "line-through";
      } else {
        todos[todoIndex].status = "todo";
        lineThrough.style.textDecoration = "none";
      }

      localStorage.setItem("todos", JSON.stringify(todos));
      loadTodoList();
      loadDoneList();
    }
  }
};

const deleteTodo = (id) => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos = todos.filter((todo) => todo.id !== id);

  localStorage.setItem("todos", JSON.stringify(todos));
  loadTodoList();
  loadDoneList();
};

const deleteAllTodo = () => {
  localStorage.clear();
  loadTodoList();
  loadDoneList();
  updatePriorityCounts();
};

const handleDeleteAll = () => {
  const btnDeleteAll = document.getElementById("btnDeleteAll");
  btnDeleteAll.addEventListener("click", () => {
    if (confirm("Are you sure want to delete all task?")) deleteAllTodo();
  });
};

const handleDateFilter = () => {
  const filterDate = document.getElementById("filterDate");
  const btnClearDateFilter = document.getElementById("btnClearDateFilter");

  filterDate.addEventListener("change", () => {
    currentDateFilter = filterDate.value;
    loadTodoList();
    loadDoneList();
  });

  btnClearDateFilter.addEventListener("click", () => {
    currentDateFilter = null;
    filterDate.value = "";
    loadTodoList();
    loadDoneList();
  });
};

const handleChangeSection = () => {
  const btnTodoList = document.getElementById("btnTodoList");
  const btnDoneList = document.getElementById("btnDoneList");
  const sectionTitle = document.getElementById("sectionTitle");
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");

  btnTodoList.addEventListener("click", () => {
    sectionTitle.textContent = "Todo";
    todoList.style.display = "flex";
    doneList.style.display = "none";
    loadTodoList();
  });
  btnDoneList.addEventListener("click", () => {
    sectionTitle.textContent = "Done";
    doneList.style.display = "flex";
    todoList.style.display = "none";
    loadDoneList();
  });
};

formModalTodo();
handleChangeSection();
handleAddTodo();
handleDeleteAll();
updatePriorityCounts();
handleDateFilter();
window.onload = () => {
  document.getElementById("doneList").style.display = "none";
  loadTodoList();
  timeWidget();
};
