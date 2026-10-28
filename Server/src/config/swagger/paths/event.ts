export const eventPaths = {
  "/event": {
    get: {
      tags: ["Event"],
      summary: "Get all event",
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
                $ref: "#/components/schemas/PaginatedEventsResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
    post: {
      tags: ["Event"],
      summary: "Create new event",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateEventBody",
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
                $ref: "#/components/schemas/EventResponse",
              },
            },
          },
        },
        "400": { description: "Not all required fields are filled in" },
        "401": { description: "Unauthorized" },
        "409": { description: "Event already exists" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/event/{id}": {
    get: {
      tags: ["Event"],
      summary: "Get event by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the event to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EventResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "Event not found" },
      },
    },
    put: {
      tags: ["Event"],
      summary: "Update event by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the event to retrieve",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateEventBody",
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
                $ref: "#/components/schemas/EventResponse",
              },
            },
          },
        },
        "400": { description: "Could not get eventID or title or type" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["Event"],
      summary: "Delete event by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the event to delete",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": { description: "User deleted successfully" },
        "401": { description: "Unauthorized" },
        "404": { description: "Event not found" },
        "500": { description: "Failed to delete event" },
      },
    },
  },
};
