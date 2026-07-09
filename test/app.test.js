const request = require("supertest");
const app = require("../app");

describe("Task Manager API Tests", () => {
  test("GET /health should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("broken");
  });

  test("GET /api/info should return project information", async () => {
    const response = await request(app).get("/api/info");

    expect(response.statusCode).toBe(200);
    expect(response.body.project).toBe(
      "Task Manager CI/CD Pipeline"
    );
  });

  test("POST /api/tasks should create a new task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Learn Jenkins Pipeline"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(
      "Learn Jenkins Pipeline"
    );
    expect(response.body.completed).toBe(false);
  });

  test("GET /api/tasks should return tasks", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("PATCH /api/tasks/1 should complete the task", async () => {
    const response = await request(app)
      .patch("/api/tasks/1")
      .send({
        completed: true
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("DELETE /api/tasks/1 should delete the task", async () => {
    const response = await request(app)
      .delete("/api/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Task deleted successfully"
    );
  });
});