const request = require("supertest");
const app = require("../server");

describe("User API", () => {
  it("GET /users -> should return list of users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
  });

  it("POST /users -> should create new user", async () => {
    const newUser = { name: "Cu", email: "cu@example.com" };
    const res = await request(app).post("/users").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Cu");
  });
});
