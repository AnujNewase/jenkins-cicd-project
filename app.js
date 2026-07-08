const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CI/CD Node.js application is running!"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/api/info", (req, res) => {
  res.status(200).json({
    project: "Jenkins Docker CI/CD Pipeline",
    version: "1.0.0"
  });
});

module.exports = app;