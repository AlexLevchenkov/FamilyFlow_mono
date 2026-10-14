import z from "zod";
import { Request, Response, NextFunction } from "express";
import { makeValidator, ValidationError, AppError } from "@/utils";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    query: {},
    params: {},
    originalUrl: "/test",
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

describe("makeValidator (Zod validation middleware)", () => {
  const emailSchema = z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Invalid email",
      }),
  });

  const listSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["shopping", "tasks", "events"], {
      error: "Type must be shopping, tasks or events",
    }),
  });

  const passwordSchema = z.object({
    password: z
      .string()
      .min(8)
      .max(20)
      .refine((p) => /[A-Z]/.test(p), {
        message: "Password must contain uppercase letters",
      })
      .refine((p) => /[a-z]/.test(p), {
        message: "Password must contain lowercase letters",
      })
      .refine((p) => /[0-9]/.test(p), {
        message: "Password must contain numbers",
      })
      .refine((p) => /[!@#$%^&*]/.test(p), {
        message: "Password must contain special characters (!@#$%^&*)",
      }),
  });

  describe("valid input", () => {
    it("should call next() with no error and set req.validated on valid email", () => {
      const validate = makeValidator(emailSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { email: "user@example.com" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith();
      expect((req as any).validated).toEqual({ email: "user@example.com" });
    });

    it("should normalise email to lowercase and trim whitespace", () => {
      const validate = makeValidator(emailSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { email: "  User@Example.COM  " } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith();
      expect((req as any).validated.email).toBe("user@example.com");
    });

    it("should accept valid list type values", () => {
      const validate = makeValidator(listSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;

      for (const type of ["shopping", "tasks", "events"] as const) {
        const req = mockReq({ body: { title: "My list", type } });
        validate(req, mockRes(), next);
        expect(next).toHaveBeenLastCalledWith();
      }
    });
  });

  describe("invalid input → ValidationError (400)", () => {
    it("should pass a ValidationError to next() for an invalid email", () => {
      const validate = makeValidator(emailSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { email: "not-an-email" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.statusCode).toBe(400);
      expect(err.message).toMatch(/Invalid email/);
    });

    it("should pass a ValidationError to next() for an empty list title", () => {
      const validate = makeValidator(listSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { title: "", type: "tasks" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.statusCode).toBe(400);
    });

    it("should pass a ValidationError to next() for an invalid list Type enum value", () => {
      const validate = makeValidator(listSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { title: "Test", type: "invalid_type" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.statusCode).toBe(400);
    });

    it("should report missing uppercase letter in password", () => {
      const validate = makeValidator(passwordSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { password: "alllower1!" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.message).toMatch(/uppercase/);
    });

    it("should report missing special character in password", () => {
      const validate = makeValidator(passwordSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ body: { password: "NoSpecial1" } });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.message).toMatch(/special characters/);
    });

    it("should read from query params when sources.query is true", () => {
      const schema = z.object({ page: z.coerce.number().min(1) });
      const validate = makeValidator(schema, { query: true });
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ query: { page: "-5" } as any });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it("should read from route params when sources.params is true", () => {
      const schema = z.object({ id: z.coerce.number() });
      const validate = makeValidator(schema, { params: true });
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({ params: { id: "not-a-number" } as any });

      validate(req, mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it("should include the request URL in the error message", () => {
      const validate = makeValidator(emailSchema);
      const next = jest.fn() as jest.MockedFunction<NextFunction>;
      const req = mockReq({
        body: { email: "bad" },
        originalUrl: "/api/auth/login",
      });

      validate(req, mockRes(), next);

      const err = next.mock.calls[0][0] as unknown as ValidationError;
      expect(err.message).toContain("/api/auth/login");
    });
  });
});

describe("errorHandler middleware", () => {
  const { errorHandler } = require("@middleware/error");

  function mockJsonRes() {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    return { res: { status } as unknown as Response, status, json };
  }

  it("should return the AppError statusCode and message for known errors", () => {
    const { res, status, json } = mockJsonRes();
    const err = new AppError("Not found", 404);
    const next = jest.fn() as jest.MockedFunction<NextFunction>;

    errorHandler(err, mockReq(), res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      status: "error",
      message: "Not found",
    });
  });

  it("should return 400 and message for ValidationError", () => {
    const { res, status, json } = mockJsonRes();
    const err = new ValidationError("Bad input");
    const next = jest.fn() as jest.MockedFunction<NextFunction>;

    errorHandler(err, mockReq(), res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      status: "error",
      message: "Bad input",
    });
  });

  it("should return 500 with a generic message and NOT expose the stack trace for unknown errors", () => {
    const { res, status, json } = mockJsonRes();
    const err = new Error("Something exploded internally");
    const next = jest.fn() as jest.MockedFunction<NextFunction>;
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    errorHandler(err, mockReq(), res, next);

    expect(status).toHaveBeenCalledWith(500);

    const responseBody = json.mock.calls[0][0];
    expect(responseBody.message).toBe("Internal Server Error");
    expect(JSON.stringify(responseBody)).not.toContain(
      "Something exploded internally",
    );
    expect(JSON.stringify(responseBody)).not.toContain("stack");

    consoleSpy.mockRestore();
  });

  it("should not expose internal error details in the 500 response body", () => {
    const { res, status, json } = mockJsonRes();
    const err = new Error("SELECT * FROM users -- SQL injection details");
    const next = jest.fn() as jest.MockedFunction<NextFunction>;
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    errorHandler(err, mockReq(), res, next);

    const body = json.mock.calls[0][0];
    expect(JSON.stringify(body)).not.toContain("SELECT");
    expect(JSON.stringify(body)).not.toContain("SQL injection");

    consoleSpy.mockRestore();
  });
});
