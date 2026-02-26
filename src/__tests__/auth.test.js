import request from "supertest";
import { app } from "../app";
// import { redisclient } from "../config/redisdb";
// import { pool } from "../src/config/db.js";

// describe("Auth API", () => {
//   it("this should return 404 for unkown routes", async () => {
//     const res = await request(app).get("/unknown");

//     expect(res.statusCode).toBe(404);
//   });
// });

// describe("Auth API - Register user", () => {
//   it("user registered successfully", async () => {
//     const userData = {
//       name: "Mahesh",
//       email: "Test@231gmail.com",
//       password: "Mahesh@#2004",
//     };

//     const res = await request(app).post("/api/auth/register").send(userData);

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("message");
//   });
// });

describe("Auth API - Login user",()=>{
  it("Login successfully",async()=>{
    const userdata={
      email:"Test@231gmail.com",
      password:"Mahesh@#2004",
    }

    const response = await request(app).post("/api/auth/login")
    .send(userdata);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("login successfully");
  })
})
// afterAll(async () => {
// await pool.end();
// });

// afterAll(async () => {
//   await redisclient.quit();
// });