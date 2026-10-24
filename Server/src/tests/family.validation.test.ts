import {
  validateCreateFamily,
  validateAddFamilyMember,
  validateUpdateFamilyMemberRole,
} from "@middleware/schemas/family";
import { Request, Response, NextFunction } from "express";

describe("Family Validation Schemas", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      originalUrl: "/family",
    };
    res = {};
    next = jest.fn();
  });

  describe("validateCreateFamily", () => {
    it("should pass when valid name is provided", () => {
      req.body = { name: "The Incredibles" };
      validateCreateFamily(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.validated).toEqual({ name: "The Incredibles" });
    });

    it("should fail when name is empty", () => {
      req.body = { name: "   " };
      validateCreateFamily(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe("validateAddFamilyMember", () => {
    it("should pass when valid email is provided", () => {
      req.params = { id: "1" };
      req.body = { email: "member@example.com", role: "CHILD" };

      validateAddFamilyMember(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.validated).toEqual(
        expect.objectContaining({
          id: 1,
          email: "member@example.com",
          role: "CHILD",
        })
      );
    });

    it("should pass when valid userId is provided", () => {
      req.params = { id: "1" };
      req.body = { userId: "42" };

      validateAddFamilyMember(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.validated).toEqual(
        expect.objectContaining({
          id: 1,
          userId: 42,
          role: "MEMBER",
        })
      );
    });

    it("should fail when neither email nor userId is provided", () => {
      req.params = { id: "1" };
      req.body = { role: "MEMBER" };

      validateAddFamilyMember(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe("validateUpdateFamilyMemberRole", () => {
    it("should pass with valid role", () => {
      req.params = { id: "1", memberId: "5" };
      req.body = { role: "PARENT" };

      validateUpdateFamilyMemberRole(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.validated).toEqual({
        id: 1,
        memberId: 5,
        role: "PARENT",
      });
    });

    it("should fail with invalid role", () => {
      req.params = { id: "1", memberId: "5" };
      req.body = { role: "SUPERUSER" };

      validateUpdateFamilyMemberRole(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });
});
