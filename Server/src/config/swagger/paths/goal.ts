export const goalPaths = {
  "/goal": {
    get: {
      tags: ["Goal"],
      summary: "Get all goals",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "listId",
          description: "List id",
          schema: { type: "number" },
        },
        {
          in: "query",
          name: "page",
          description: "Page number",
          schema: { type: "number" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaginatedItemsListResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "Can't get ItemsList" },
        "500": { description: "Internal server error" },
      },
    },
    post: {
      tags: ["Goal"],
      summary: "Create new goal",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateItemsListRequest",
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
                $ref: "#/components/schemas/ItemResponse",
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
  "/goal/{id}": {
    get: {
      tags: ["Goal"],
      summary: "Get goal by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the item list to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ItemResponse",
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
      tags: ["Goal"],
      summary: "Update goal by ID",
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
              $ref: "#/components/schemas/UpdateItemsListRequest",
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
                $ref: "#/components/schemas/ItemResponse",
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
      tags: ["Goal"],
      summary: "Delete goal by ID",
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
};
