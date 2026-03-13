console.log("App started");

// Application state
let state = {
  todo: [],
  doing: [],
  done: [],
};

loadState();
render();

const buttons = document.querySelectorAll(".add-task");

// Add task
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const text = prompt("Enter task");
    if (!text) return;

    const column = button.parentElement.id;

    state[column].push(text);

    saveState();
    render();
  });
});

const columns = document.querySelectorAll(".tasks");

columns.forEach((column) => {
  column.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  column.addEventListener("drop", function (e) {
    e.preventDefault();

    const taskText = e.dataTransfer.getData("text/plain");

    for (let col in state) {
      state[col] = state[col].filter((task) => task !== taskText);
    }

    const newColumn = column.parentElement.id;

    state[newColumn].push(taskText);

    saveState();
    render();
  });
});

// Delete task (event delegation)
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete")) {
    const taskText =
      event.target.parentElement.querySelector("span").textContent;

    for (let column in state) {
      state[column] = state[column].filter((task) => task !== taskText);
    }

    saveState();
    render();
  }
});

function saveState() {
  localStorage.setItem("kanbanState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("kanbanState");

  if (saved) {
    state = JSON.parse(saved);
  }
}

function render() {
  document.querySelectorAll(".tasks").forEach((container) => {
    container.innerHTML = "";
  });

  for (let column in state) {
    const container = document.querySelector(`#${column} .tasks`);

    state[column].forEach((taskText) => {
      const task = document.createElement("div");
      task.className = "task";
      task.draggable = true;

      task.addEventListener("dragstart", function (e) {
        console.log("drag started");
        e.dataTransfer.setData("text/plain", taskText);
      });

      task.innerHTML = `
        <span>${taskText}</span>
        <button class="delete">X</button>
      `;

      container.appendChild(task);
    });
  }
}
