console.log('App started');

const buttons = document.querySelectorAll(".add-task");

buttons.forEach(button => {
  button.addEventListener("click", function() {
    const text = prompt("Enter task");
    if (!text) return;

    const task = document.createElement("div");

    task.className = "task";
    task.innerText = text;

    const column = this.parentElement;
    const taskContainer = column.querySelector(".tasks");

    taskContainer.appendChild(task);
  });
});