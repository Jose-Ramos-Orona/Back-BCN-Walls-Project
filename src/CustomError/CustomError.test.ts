import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When it is instantiated with message 'Internal error', statusCode 500 and public message 'Internal server error'", () => {
    test("Then it should return an instace of Error with the received properties", () => {
      const expectedError = {
        statusCode: 500,
        message: "Internal Error",
        publicMessage: "Internal server error",
      };

      const newCustomError = new CustomError(
        expectedError.statusCode,
        expectedError.message,
        expectedError.publicMessage
      );

      expect(newCustomError).toHaveProperty("message", expectedError.message);
      expect(newCustomError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
      expect(newCustomError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );

      expect(newCustomError).toBeInstanceOf(Error);
    });
  });
});
