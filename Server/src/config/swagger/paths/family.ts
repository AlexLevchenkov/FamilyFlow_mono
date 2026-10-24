export const familyPaths = {
  "/family/my": {
    get: {
      tags: ["Family"],
      summary: "Get current user's family with all members",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "User does not belong to any family" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/family": {
    post: {
      tags: ["Family"],
      summary: "Create a new family",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateFamilyRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Family created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyResponse",
              },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Unauthorized" },
        "409": { description: "User already belongs to a family" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/family/{id}": {
    get: {
      tags: ["Family"],
      summary: "Get family by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Successful request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - user is not a member" },
        "404": { description: "Family not found" },
        "500": { description: "Internal server error" },
      },
    },
    put: {
      tags: ["Family"],
      summary: "Update family details",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateFamilyRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Family updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyResponse",
              },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - requires OWNER or PARENT role" },
        "404": { description: "Family not found" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["Family"],
      summary: "Delete family (OWNER only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": { description: "Family deleted successfully" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - only OWNER can delete" },
        "404": { description: "Family not found" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/family/{id}/members": {
    get: {
      tags: ["Family"],
      summary: "Get all members of the family",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "List of family members",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/FamilyMemberResponse",
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - not a family member" },
        "500": { description: "Internal server error" },
      },
    },
    post: {
      tags: ["Family"],
      summary: "Add a member to the family by email or userId",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddFamilyMemberRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Member added successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyMemberResponse",
              },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - requires OWNER or PARENT role" },
        "404": { description: "User or Family not found" },
        "409": { description: "User already in a family" },
        "500": { description: "Internal server error" },
      },
    },
  },
  "/family/{id}/members/{memberId}": {
    put: {
      tags: ["Family"],
      summary: "Update family member role (OWNER, PARENT, CHILD, MEMBER)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
        {
          in: "path",
          name: "memberId",
          required: true,
          description: "Numeric user ID of the member",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateFamilyMemberRoleRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Member role updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FamilyMemberResponse",
              },
            },
          },
        },
        "400": { description: "Validation error or cannot demote only OWNER" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - insufficient permissions" },
        "404": { description: "Member not found" },
        "500": { description: "Internal server error" },
      },
    },
    delete: {
      tags: ["Family"],
      summary: "Remove member from family or leave family",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Numeric ID of the family",
          schema: { type: "integer" },
        },
        {
          in: "path",
          name: "memberId",
          required: true,
          description: "Numeric user ID of the member to remove",
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": { description: "Member removed or left family successfully" },
        "400": { description: "The only OWNER cannot leave without transfer" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - insufficient permissions" },
        "404": { description: "Member not found" },
        "500": { description: "Internal server error" },
      },
    },
  },
};
