export const authPaths = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "User login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful login",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid data",
        },
        401: {
          description: "Invalid credentials",
        },
      },
    },
  },
  "/auth/logout": {
    get: {
      tags: ["Auth"],
      summary: "User logout",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Logged out successfully",
        },
        400: {
          description: "Logout failed",
        },
      },
    },
  },
  "/auth/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Token refresh",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "New tokens",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshResponse",
              },
            },
          },
        },
        400: {
          description: "Unauthorized",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
  "/auth/change-password": {
    post: {
      tags: ["Auth"],
      summary: "Token refresh",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ChangePasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Change password",
        },
        400: {
          description: "Could not get user",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
  "/auth/set-password": {
    post: {
      tags: ["Auth"],
      summary: "Token refresh",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SetPasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Set new password",
        },
        400: {
          description: "Could not get user",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
  "/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Init reset password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ForgotPasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Sended mail with link",
        },
        400: {
          description: "Could not get user",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
  "/auth/reset-password": {
    post: {
      tags: ["Auth"],
      summary: "Reset password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password is changed",
        },
        400: {
          description: "Could not get user",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
  "/auth/verify-email": {
    post: {
      tags: ["Auth"],
      summary: "Verify email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EmailVerifyRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Email is verified",
        },
        400: {
          description: "Could not get user",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
};
