import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcryptjs";
import connectDb from "../../../database";
import User from "../../../database/models/User";
import type { RegisterData } from "../../types";
import app from "../../app";
import { userLoginMock, userRegisterMock } from "../../../mocks/userMock";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given the usersRouter with POST /register endpoint", () => {
  describe("When it receives a request with username 'Manolito', password '2323', email 'm@nolo.com' that isn't on the database, on its body", () => {
    test("Then it should respond with status 201 and the message: 'The user Manolito has been created correctly'", async () => {
      const requestBody = userRegisterMock;
      const expectedStatus = 201;
      const expectedMessage = {
        message: `The user Manolito has been created correctly`,
      };

      const res = await request(app)
        .post("/users/register")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Paqui', password '1234' and email 'paqui@paquita.com' that is on the database, on its body", () => {
    test("Then it should respond with", async () => {
      await User.create({
        username: "Paqui",
        password: await bcrypt.hash("1234", 10),
        email: "paqui@paquita.com",
      });
      const requestBody: RegisterData = {
        username: "Paqui",
        password: "1234",
        email: "paqui@paquita.com",
      };
      const expectedStatus = 409;
      const expectedMessage = { error: "Database error: duplicate key" };

      const res = await request(app)
        .post("/users/register")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with a username empty", () => {
    test("Then it should respons with a 400 error and message 'Opps...Data error'", async () => {
      const expectedStatus = 400;
      const expectedMessage = { error: "Opps...Data error" };
      const requestBody: RegisterData = {
        username: "",
        password: "1234",
        email: "paco@paco.com",
      };

      const res = await request(app)
        .post("/users/register")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  describe(`When it receives a request with the username 'Paco' and password 'paquito' of a user that is already in the database`, () => {
    test("Then it should respond with status 200 and a token", async () => {
      const requestBody = userLoginMock;
      const expectedStatus = 200;
      const { password } = userLoginMock;
      const passwordMock = password;
      const hashedPassword = await bcrypt.hash(passwordMock, 10);

      const registerdata: RegisterData = {
        ...userLoginMock,
        password: hashedPassword,
        email: "paco@pac.com",
      };

      await User.create(registerdata);

      const response = await request(app)
        .post("/users/login")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe(`When it receives a request with the username 'Paco' and incorrect password '3333'`, () => {
    test("Then it should respond with status 401 and a message 'Wrong credentials'", async () => {
      const requestBody = {
        ...userLoginMock,
        password: "3333",
      };
      const expectedStatus = 401;
      const expectedMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post("/users/login")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
