export const searchPaths = {
  "/search": {
    get: {
      tags: ["Search"],
      summary: "Search the current user's tasks, goals, and events",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "query",
          required: true,
          description: "Case-insensitive title substring (1-100 characters)",
          schema: { type: "string", minLength: 1, maxLength: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Grouped search results",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GlobalSearchResponse",
              },
            },
          },
        },
        "400": { description: "Invalid search query" },
        "401": { description: "Unauthorized" },
      },
    },
  },
};
