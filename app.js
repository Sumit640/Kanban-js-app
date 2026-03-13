console.log('App started');

const buttons = document.querySelectorAll(".add-task");

buttons.forEach(button => {
  button.addEventListener("click", function() {
    const text = prompt("Enter task");
    if (!text) return;

    const task = document.createElement("div");

    task.className = "task";
    task.innerHTML = `
        <span>${text}</span>
        <button class="delete">X</button>
    `;

    const column = this.parentElement;
    const taskContainer = column.querySelector(".tasks");

    taskContainer.appendChild(task);
  });
});

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete")) {
    const task = event.target.parentElement;
    task.remove();
  }
});