const addTodo = (e) => {
  e.preventDefault();

  timeNow = new Date().toLocaleString();

  const todoList = document.getElementById("todoList");
  const todo = document.getElementById("inputTodo").value;
  const priority = document.getElementById("inputPriority").value;
  const date = document.getElementById("inputDate").value;

  if (!todo || !priority || !date) {
    alert("Data belum lengkap");
    return;
  }

  const dataTodo = {
    id: Date.now(),
    todo: todo,
    date: timeNow,
    priority: priority,
    status: "todo",
  };
  /*
  todo list on another pages/modal
  todo create modal for form input
  todo create profile and show time
  todo create display priority
  todo styling the entire app
  */

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(dataTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  loadingIndicator.style.display = "none";

  todoList.innerHTML = "";

  document.getElementById("inputTodo").value = "";
  document.getElementById("inputPriority").value = "";

  loadTodoList();
};

const handleCheckboxChange = (e) => {
  if (e.target && e.target.matches(".card-todo-checkbox")) {
    const checkbox = e.target;
    const todoCard = checkbox.closest(".card-todo");
    const index = parseInt(todoCard.getAttribute("data-index"), 10);

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    const todoIndex = todos.findIndex((todo) => todo.id === index);
    console.log(todoIndex);

    if (todoIndex !== -1) {
      if (checkbox.checked) {
        todos[todoIndex].status = "done";
      } else {
        todos[todoIndex].status = "todo";
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
};

const handleDeleteAll = () => {
  const btnDeleteAll = document.getElementById("btnDeleteAll");
  btnDeleteAll.addEventListener("click", () => {
    if (confirm("Are you sure want to delete all task?")) deleteAllTodo();
  });
};

const loadTodoList = () => {
  const todoList = document.getElementById("todoList");

  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  console.log(todos[0]);

  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = `<p class="emptyData">Tidak ada data</p>`;
  } else {
    todos.forEach((todo) => {
      if (todo.status === "todo") {
        const cardTodoElement = document.createElement("div");
        cardTodoElement.classList.add("card-todo");
        cardTodoElement.setAttribute("data-index", todo.id);
        cardTodoElement.innerHTML = `
        <div class="card-content">
          <p class="card-todo-desc">${todo.todo}</p>
        </div>
        <div class="card-todo-footer">
          <span class="card-todo-time">${todo.date}</span>
          <span class="card-todo-priority">${todo.priority}</span>
          <button class="card-todo-delete">Del</button>
          <input type="checkbox" class="card-todo-checkbox" ${
            todo.status === "done" ? "checked" : ""
          }>
        </div>
    `;
        todoList.appendChild(cardTodoElement);
        const deleteBtn = cardTodoElement.querySelector(".card-todo-delete");
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
      }
    });
  }

  todoList.addEventListener("change", handleCheckboxChange);
};

const loadDoneList = () => {
  const doneList = document.getElementById("doneList");

  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  const filteredList = todos.filter((todo) => todo.status === "done");

  doneList.innerHTML = "";

  if (filteredList.length === 0) {
    doneList.innerHTML = `<p class="emptyData">Tidak ada data</p>`;
  } else {
    filteredList.forEach((todo) => {
      const cardTodoElement = document.createElement("div");
      cardTodoElement.classList.add("card-todo");
      cardTodoElement.setAttribute("data-index", todo.id);
      cardTodoElement.innerHTML = `
      <div class="card-content">
        <p class="card-todo-desc">${todo.todo}</p>
      </div>
      <div class="card-todo-footer">
        <span class="card-todo-time">${todo.date}</span>
        <span class="card-todo-priority">${todo.priority}</span>
        <input type="checkbox" class="card-todo-checkbox" ${
          todo.status === "done" ? "checked" : ""
        }>
      </div>
  `;
      doneList.appendChild(cardTodoElement);
    });
  }

  doneList.addEventListener("change", handleCheckboxChange);
};

const handleAddTodo = () => {
  const todoForm = document.getElementById("todoForm");
  todoForm.addEventListener("submit", addTodo);
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

handleChangeSection();
handleAddTodo();
window.onload = loadTodoList;
