import { authenticate } from "@middleware/authenticate";
import jwt from "jsonwebtoken";
import keyRotationService from "@utils/keyRotation";
import { Request, Response } from "express";

jest.mock("@utils/keyRotation", () => ({
  getCurrentKeys: jest.fn(),
  getPreviousKeys: jest.fn(),
}));

describe("authenticate middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const currentAccessSecret = "current_secret";
  const previousAccessSecret = "previous_secret";

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();

    (keyRotationService.getCurrentKeys as jest.Mock).mockReturnValue({
      access: currentAccessSecret,
      refresh: "current_refresh",
    });
    (keyRotationService.getPreviousKeys as jest.Mock).mockReturnValue({
      previousAccess: previousAccessSecret,
      previousRefresh: "previous_refresh",
    });
  });

  it("should call next with unauthorized error if no token is provided", () => {
    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "No token provided",
        statusCode: 401,
      }),
    );
  });

  it("should call next with unauthorized error if token format is invalid", () => {
    req.headers!.authorization = "invalid_format_token";

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid token format",
        statusCode: 401,
      }),
    );
  });

  it("should successfully authenticate with a valid current token", () => {
    const payload = { userId: 123, role: "user" };
    const token = jwt.sign(payload, currentAccessSecret);
    req.headers!.authorization = `Bearer ${token}`;

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({
      id: 123,
      role: "user",
      jti: "",
    });
  });

  it("should successfully authenticate with a valid previous token", () => {
    const payload = { userId: 456, role: "admin" };
    const token = jwt.sign(payload, previousAccessSecret);
    req.headers!.authorization = `Bearer ${token}`;

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({
      id: 456,
      role: "admin",
      jti: "",
    });
  });

  it("should call next with unauthorized error if token is expired", () => {
    const payload = { userId: 123, role: "user" };
    const token = jwt.sign(payload, currentAccessSecret, { expiresIn: "-1s" });
    req.headers!.authorization = `Bearer ${token}`;

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid token",
        statusCode: 401,
      }),
    );
  });

  it("should call next with unauthorized error if token key is unknown", () => {
    const payload = { userId: 123, role: "user" };
    const token = jwt.sign(payload, "unknown_secret");
    req.headers!.authorization = `Bearer ${token}`;

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid token",
        statusCode: 401,
      }),
    );
  });
});
