export const userPaths = {
  "/user": {
    get: {
      tags: ["User"],
      summary: "Get all users",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          description: "Page number",
          schema: { type: "string" },
        },
        {
          in: "query",
          name: "partName",
          description: "Part of the username",
          schema: { type: "string" },
        },
        {
          in: "query",
          name: "partEmail",
          description: "Part of the user's email",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaginatedUsersResponse",
              },
            },
          },
        },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "Can't get users" },
        "500": { description: "Internal server error" },
      },
    },
    post: {
      tags: ["User"],
      summary: "Create new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateUserRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse",
              },
            },
          },
        },
        "400": { description: "Bad request" },
        "409": { description: "User already exists" },
        "500": { description: "Internal server error" },
      },
    },
    put: {
      tags: ["User"],
      summary: "Update yourself",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateUserBody",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse",
              },
            },
          },
        },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["User"],
      summary: "Delete yourself",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the user to delete",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": { description: "User deleted successfully" },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/user/{id}": {
    get: {
      tags: ["User"],
      summary: "Get user by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the user to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse",
              },
            },
          },
        },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/user/me": {
    get: {
      tags: ["User"],
      summary: "Get yourself",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
  },
};
