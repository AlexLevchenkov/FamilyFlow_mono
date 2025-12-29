export const listPaths = {
  "/list": {
    get: {
      tags: ["List"],
      summary: "Get all list",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          description: "Page number",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaginatedListsResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "Can't get lists" },
        "500": { description: "Internal server error" },
      },
    },
    post: {
      tags: ["List"],
      summary: "Create new list",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateListRequest",
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
                $ref: "#/components/schemas/ListResponse",
              },
            },
          },
        },
        "400": { description: "Registration failed" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/list/{id}": {
    get: {
      tags: ["List"],
      summary: "Get list by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the list to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ListResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "Can't get list" },
        "500": { description: "Internal server error" },
      },
    },
    put: {
      tags: ["List"],
      summary: "Update list by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the list to retrieve",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateListRequest",
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
                $ref: "#/components/schemas/ListResponse",
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
      tags: ["List"],
      summary: "Delete list by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the list to delete",
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
  "/list/share": {
    post: {
      tags: ["List"],
      summary: "Create share list",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/shareListRequest",
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
                $ref: "#/components/schemas/shareListResponse",
              },
            },
          },
        },
        "400": { description: "Registration failed" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["List"],
      summary: "Delete shared list connect",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "listId",
          description: "List id",
          schema: { type: "integer" },
        },
        {
          in: "query",
          name: "ownerId",
          description: "User Id who own this list",
          schema: { type: "integer" },
        },
        {
          in: "query",
          name: "recipientId",
          description: "User Id that has access to the list",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "201": { description: "User has access to the list" },
        "400": { description: "Registration failed" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
  },
};
