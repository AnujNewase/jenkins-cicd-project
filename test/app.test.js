const request = require("supertest");
const app = require("../app");

describe("Node.js API Tests", () => {

  test("GET /health should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /api/info should return project information", async () => {
    const response = await request(app).get("/api/info");

    expect(response.statusCode).toBe(200);
    expect(response.body.project).toBe(
      "Jenkins Docker CI/CD Pipeline"
    );
  });

});