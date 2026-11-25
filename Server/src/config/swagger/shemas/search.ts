const searchResultSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    date: { type: "string", format: "date-time", nullable: true },
  },
  required: ["id", "title", "date"],
};

export const searchSchemas = {
  GlobalSearchResponse: {
    type: "object",
    properties: {
      tasks: { type: "array", items: searchResultSchema },
      goals: { type: "array", items: searchResultSchema },
      events: { type: "array", items: searchResultSchema },
    },
    required: ["tasks", "goals", "events"],
  },
};
