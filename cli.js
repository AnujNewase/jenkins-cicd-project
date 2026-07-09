const readline = require("readline");

const API_URL = "http://localhost:3000/api/tasks";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function addTask() {
  const title = await ask("\nEnter task title: ");

  if (!title.trim()) {
    console.log("\nTask title cannot be empty.");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });

  const task = await response.json();

  console.log(`\nTask added successfully! ID: ${task.id}`);
}

async function viewTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  console.log("\n===== YOUR TASKS =====");

  if (tasks.length === 0) {
    console.log("No tasks available.");
    return;
  }

  tasks.forEach((task) => {
    const status = task.completed ? "Completed" : "Pending";

    console.log(
      `${task.id}. ${task.title} - ${status}`
    );
  });
}

async function completeTask() {
  await viewTasks();

  const id = await ask("\nEnter task ID to mark as completed: ");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });

  const result = await response.json();

  if (!response.ok) {
    console.log(`\nError: ${result.error}`);
    return;
  }

  console.log("\nTask marked as completed!");
}

async function deleteTask() {
  await viewTasks();

  const id = await ask("\nEnter task ID to delete: ");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const result = await response.json();

  if (!response.ok) {
    console.log(`\nError: ${result.error}`);
    return;
  }

  console.log("\nTask deleted successfully!");
}

async function showMenu() {
  while (true) {
    console.log(`
==============================
       TASK MANAGER CLI
==============================

1. Add Task
2. View Tasks
3. Complete Task
4. Delete Task
5. Exit
`);

    const choice = await ask("Choose an option: ");

    try {
      switch (choice.trim()) {
        case "1":
          await addTask();
          break;

        case "2":
          await viewTasks();
          break;

        case "3":
          await completeTask();
          break;

        case "4":
          await deleteTask();
          break;

        case "5":
          console.log("\nGoodbye!");
          rl.close();
          return;

        default:
          console.log("\nInvalid option. Choose between 1 and 5.");
      }
    } catch (error) {
      console.log("\nCould not connect to the Task Manager API.");
      console.log("Make sure the application container is running.");
    }
  }
}

showMenu();