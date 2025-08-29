const request = require("supertest");
const app = require("../server");

describe("Success route", () => {
  it("should return success message", async () => {
    const res = await request(app).get("/success");
    expect(res.status).toBe(200);
    expect(res.text).toContain("✅ Thanh toán thành công!");
  });
});
