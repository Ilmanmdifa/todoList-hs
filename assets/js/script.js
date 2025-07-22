const now = new Date();
const formattedDate = new Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});
const timeClock = now.getHours() + ":" + now.getMinutes();
const data = [
  {
    todo: "Belajar Javascript setiap hari dari pagi sampai malam-malam",
    time: formattedDate.format(now) + " " + timeClock,
    priority: "high",
  },
];

//todo edit card style
console.log(data);
//sementara

const todoDesc = document.getElementById("todoDesc");
const todoTime = document.getElementById("todoTime");
const todoPriority = document.getElementById("todoPriority");

todoDesc.textContent = data[0].todo;
todoTime.textContent = data[0].time;
todoPriority.textContent = data[0].priority;
//end sementara
const addTodo = () => {
  const todo = document.getElementById("inputTodo").value;
  const priority = document.getElementById("inputPriority").value;
  const todoList = document.getElementById("todoList");

  const cardTodo = document.createElement("div");
  cardTodo.classList.add("card-todo");

  const dataTodo = {
    todo: todo,
    time: formattedDate.format(now) + " " + timeClock,
    priority: priority,
    status: "todo",
  };

  todoList.appendChild(cardTodo);

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  cardTodo.appendChild(cardContent);

  const todoDesc = document.createElement("p");
  todoDesc.classList.add("card-todo-desc");
  todoDesc.textContent = dataTodo.todo;
  cardContent.appendChild(todoDesc);

  const cardTodoFooter = document.createElement("div");
  cardTodoFooter.classList.add("card-todo-footer");
  cardTodo.appendChild(cardTodoFooter);

  const todoTime = document.createElement("span");
  todoTime.classList.add("card-todo-time");
  todoTime.textContent = dataTodo.time;
  cardTodoFooter.appendChild(todoTime);

  const todoPriority = document.createElement("span");
  todoPriority.classList.add("card-todo-priority");
  todoPriority.textContent = dataTodo.priority;
  cardTodoFooter.appendChild(todoPriority);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("card-todo-checkbox");
  cardTodoFooter.appendChild(checkbox);

  document.getElementById("inputTodo").value = "";
  document.getElementById("inputPriority").value = "";
};

const handleAddTodo = () => {
  const btnAddTodo = document.getElementById("btnAddTodo");
  btnAddTodo.addEventListener("click", addTodo);
};

handleAddTodo();

// const checkbox = document.createElement("input");
// checkbox.type = "checkbox";

// console.log(checkbox);
