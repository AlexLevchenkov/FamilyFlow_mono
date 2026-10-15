export const familyPaths = {
  '/family': {
    get: {
      tags: ['Family'],
      summary: "Get or create the authenticated user's family",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Family and registered members',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FamilyResponse' },
            },
          },
        },
        '401': { description: 'Unauthorized' },
      },
    },
  },
  '/family/members': {
    post: {
      tags: ['Family'],
      summary: 'Add a registered user to the family by email',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AddFamilyMemberRequest' },
          },
        },
      },
      responses: {
        '201': { description: 'Family member added' },
        '400': { description: 'Invalid request or self-invitation' },
        '404': { description: 'No registered account exists for this email' },
        '409': { description: 'User already belongs to a family' },
        '401': { description: 'Unauthorized' },
      },
    },
  },
};
