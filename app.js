const express = require("express");

const app = express();

app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Manager API is running!"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/api/info", (req, res) => {
  res.status(200).json({
    project: "Task Manager CI/CD Pipeline",
    version: "1.0.0",
    deployment: "Automated with Jenkins CI/CD"
  });
});

app.get("/api/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Task title is required"
    });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "completed must be true or false"
    });
  }

  task.completed = completed;

  res.status(200).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

module.exports = app;