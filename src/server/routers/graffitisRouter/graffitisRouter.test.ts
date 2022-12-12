import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDb from "../../../database";
import { Graffiti } from "../../../database/models/Graffiti";
import graffitiMock from "../../../mocks/graffitiMock";
import graffitiMockCreate from "../../../mocks/graffitiMockCreate";
import app from "../../app";

let server: MongoMemoryServer;
const graffiti = graffitiMock;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
  await Graffiti.create(graffiti);
});

beforeEach(async () => {
  await Graffiti.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe(" Given the graffitisRouter with method GET and /graffitis/list endpoint", () => {
  describe("When it receives a request with an empty body", () => {
    test("Then it should respond with a '200' status", async () => {
      const status = 200;
      const expectedProperty = "graffitis";

      const response = await request(app).get("/graffitis/list").expect(status);

      expect(response.body).toHaveProperty(expectedProperty);
    });
  });

  describe("When it receives a request with no graffitis in the data base", () => {
    test("Then it should respond with a '200' status and an object with property 'graffitis' that has an array of empty graffitis", async () => {
      const status = 200;

      Graffiti.find = jest.fn().mockReturnValue(null);

      const response = await request(app).get("/graffitis/list").expect(status);

      expect(response.body).toStrictEqual({ graffitis: null });
    });
  });

  describe("When it receives a request and an internal server error is triggered", () => {
    test("Then it should return a '500' status", async () => {
      const status = 500;
      const errorMessage = { error: "Graffitis are missing!" };

      Graffiti.find = jest.fn().mockRejectedValue(errorMessage);

      const response = await request(app).get("/graffitis/list").expect(status);

      expect(response.body).toStrictEqual(errorMessage);
    });
  });
});

describe("Given the graffitisRouter with method DELETE and graffitis/delete/:idGraffiti endpoint", () => {
  describe("When it receives a request with a valid idGraffiti", () => {
    test("Then it should a response with status '200'", async () => {
      const expectedStatus = 200;

      await request(app)
        .delete(`/graffitis/delete/${graffiti._id}`)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request and an internal server error is triggered", () => {
    test("Then it should return a '500' status with text 'Graffiti is missing!'", async () => {
      const expectedStatus = 500;
      const errorMessage = { error: "Graffiti is missing!" };

      Graffiti.findByIdAndDelete = jest.fn().mockRejectedValue(errorMessage);

      const response = await request(app)
        .delete(`/graffitis/delete/${graffiti._id}`)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(errorMessage);
    });
  });
});

describe("Given the graffitisRouter with method POST and graffitis/create endpoint", () => {
  describe("When it receives a request with a valid graffiti", () => {
    test("Then it should a response with status '201'", async () => {
      const expectedStatus = 201;
      const requestBody = graffitiMockCreate;

      const res = await request(app)
        .post("/graffitis/create")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toHaveProperty("graffiti");
    });
  });

  describe("When it receives a request and an internal server error is triggered", () => {
    test("Then it should return a '500' status with text 'Graffiti is missing!'", async () => {
      const expectedStatus = 500;
      const errorMessage = { error: "Graffiti is missing!" };

      Graffiti.create = jest.fn().mockRejectedValue(errorMessage);

      const response = await request(app)
        .post(`/graffitis/create`)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(errorMessage);
    });
  });
});

describe("Given the graffitisRouter with method GET and graffitis/detail/:idGraffiti endpoint", () => {
  describe("When it receives a request with a valid idGraffiti", () => {
    test("Then it should a response with status '200'", async () => {
      const expectedStatus = 200;

      await request(app)
        .get(`/graffitis/detail/${graffiti._id}`)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request and an internal server error is triggered", () => {
    test("Then it should return a '500' status with text 'Graffiti is missing!'", async () => {
      const expectedStatus = 500;
      const errorMessage = { error: "Graffiti is missing!" };

      Graffiti.findById = jest.fn().mockRejectedValue(errorMessage);

      const response = await request(app)
        .get(`/graffitis/detail/${graffiti._id}`)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(errorMessage);
    });
  });
});
