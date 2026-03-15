console.log("App started");

let state = {
  todo: [],
  doing: [],
  done: [],
};

let activeColumn = null;
let searchTerm = "";

const form = document.getElementById("taskForm");

loadState();
renderBoard();

/* OPEN FORM */

document.querySelectorAll(".add-task").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeColumn = btn.parentElement.id;

    form.classList.remove("hidden");

    document.getElementById("taskText").focus();
  });
});

/* CANCEL FORM */

document.getElementById("cancelForm").addEventListener("click", () => {
  form.classList.add("hidden");
});

/* CREATE TASK */

document.getElementById("createTask").addEventListener("click", () => {
  const text = document.getElementById("taskText").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDate").value;

  if (!text || !activeColumn) return;

  state[activeColumn].push({
    id: Date.now(),
    text,
    priority,
    dueDate,
  });

  saveState();
  renderBoard();

  form.classList.add("hidden");

  document.getElementById("taskText").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskPriority").value = "low";
});

/* SEARCH */

document.getElementById("search").addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderBoard();
});

/* DRAG & DROP */

document.querySelectorAll(".tasks").forEach((container) => {
  container.addEventListener("dragover", (e) => e.preventDefault());

  container.addEventListener("drop", (e) => {
    e.preventDefault();

    const taskId = Number(e.dataTransfer.getData("text/plain"));

    let draggedTask = null;

    for (let col in state) {
      const index = state[col].findIndex((t) => t.id === taskId);

      if (index !== -1) {
        draggedTask = state[col][index];

        state[col].splice(index, 1);

        break;
      }
    }

    if (!draggedTask) return;

    const newColumn = container.parentElement.id;

    state[newColumn].push(draggedTask);

    saveState();
    renderBoard();
  });
});

/* DELETE */

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const taskId = Number(event.target.dataset.id);

    for (let col in state) {
      state[col] = state[col].filter((t) => t.id !== taskId);
    }

    saveState();
    renderBoard();
  }
});

/* CREATE TASK ELEMENT */

function createTaskElement(task) {
  const el = document.createElement("div");

  el.className = "task";

  el.draggable = true;

  el.innerHTML = `
<span>${task.text}</span>
<small>${task.dueDate ? "Due: " + task.dueDate : ""}</small>
<button class="delete" data-id="${task.id}">X</button>
`;

  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    el.classList.add("dragging");
  });

  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });

  el.addEventListener("dblclick", () => {
    const newText = prompt("Edit task", task.text);

    if (!newText) return;

    for (let col in state) {
      state[col] = state[col].map((t) =>
        t.id === task.id ? { ...t, text: newText } : t,
      );
    }

    saveState();
    renderBoard();
  });

  el.classList.add(task.priority);

  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    el.classList.add("overdue");
  }

  return el;
}

/* SORT */

function sortTasks(tasks) {
  const order = { high: 1, medium: 2, low: 3 };

  return tasks.sort((a, b) => {
    if (order[a.priority] !== order[b.priority])
      return order[a.priority] - order[b.priority];

    if (a.dueDate && b.dueDate)
      return new Date(a.dueDate) - new Date(b.dueDate);

    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    return 0;
  });
}

/* RENDER COLUMN */

function renderColumn(name) {
  const container = document.querySelector(`#${name} .tasks`);

  container.innerHTML = "";

  const filtered = state[name].filter((t) =>
    t.text.toLowerCase().includes(searchTerm),
  );

  const sorted = sortTasks(filtered);

  sorted.forEach((task) => {
    container.appendChild(createTaskElement(task));
  });
}

/* RENDER BOARD */

function renderBoard() {
  renderColumn("todo");
  renderColumn("doing");
  renderColumn("done");
}

/* STORAGE */

function saveState() {
  localStorage.setItem("kanbanState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("kanbanState");

  if (saved) state = JSON.parse(saved);
}
