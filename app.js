console.log('App started');

// Application state -> holding all tasks of the application
let state = {
  todo: [],
  doing: [],
  done: []
};
let draggedTask = null;

loadState();
render();

const buttons = document.querySelectorAll(".add-task");

buttons.forEach(button => {
  button.addEventListener("click", function() {
    const text = prompt("Enter task");
    if (!text) return;

    const column = this.parentElement;
    const columnId = column.id;

    state[columnId].push(text);

    saveState();
    render();
  });
});

// Event delegation - instead of assign click event to each delete button
// assign it to its parent element so that through event propogation
// the event eventually travels through its child nodes
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete")) {
    const taskElement = event.target.parentElement;
    const column = taskElement.closest(".column");

    const columnId = column.id;

    const taskText = taskElement.querySelector("span").innerText;

    state[columnId] = state[columnId].filter(task => task !== taskText);
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
    document.querySelectorAll(".tasks").forEach(container => {
        container.innerHTML = "";
    });

    for (let column in state) {
        const container = document.querySelector(`#${column} .tasks`);
        state[column].forEach(taskText => {
            const task = document.createElement("div");
            task.className = "task";
            task.draggable = true;
            task.innerHTML = `
            <span>${taskText}</span>
            <button class="delete">X</button>
            `;

            task.addEventListener("dragstart", function() {
                draggedTask = taskText;
            });

            container.appendChild(task);
        });

        document.querySelectorAll(".column").forEach(column => {
            column.addEventListener("dragover", function(event) {
                event.preventDefault();
            });

            column.addEventListener("drop", function() {
                const targetColumn = column.id;
                for (let col in state) {
                    state[col] = state[col].filter(task => task !== draggedTask);
                }
                state[targetColumn].push(draggedTask);
                saveState();
                render();
            });
        });
    }
}