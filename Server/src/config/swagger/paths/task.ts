export const taskPaths = {
  "/task": {
    get: {
      tags: ["Task"],
      summary: "Get all task",
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
                $ref: "#/components/schemas/PaginatedTasksResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
    post: {
      tags: ["Task"],
      summary: "Create new task",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTaskBody",
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
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        "400": { description: "Not all required fields are filled in" },
        "401": { description: "Unauthorized" },
        "409": { description: "Task already exists" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/task/{id}": {
    get: {
      tags: ["Task"],
      summary: "Get task by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the task to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "Task not found" },
      },
    },
    put: {
      tags: ["Task"],
      summary: "Update task by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the task to retrieve",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTaskBody",
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
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        "400": { description: "Could not get taskID or title or type" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["Task"],
      summary: "Delete task by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the task to delete",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": { description: "User deleted successfully" },
        "401": { description: "Unauthorized" },
        "404": { description: "Task not found" },
        "500": { description: "Failed to delete task" },
      },
    },
  },
};
