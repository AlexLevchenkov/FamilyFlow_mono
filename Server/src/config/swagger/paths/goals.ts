export const goalsPaths = {
  '/goal': {
    get: {
      tags: ['Goal'],
      summary: "Get goals for the authenticated user's family",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Family goals',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/GoalResponse' },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
      },
    },
    post: {
      tags: ['Goal'],
      summary: 'Create a family goal',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGoalRequest' },
          },
        },
      },
      responses: {
        '201': { description: 'Goal created' },
        '400': { description: 'Invalid goal' },
        '401': { description: 'Unauthorized' },
      },
    },
  },
  '/goal/{id}': {
    put: {
      tags: ['Goal'],
      summary: 'Update a family goal',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateGoalRequest' },
          },
        },
      },
      responses: {
        '200': { description: 'Goal updated' },
        '400': { description: 'Invalid goal' },
        '404': { description: 'Goal not found' },
        '401': { description: 'Unauthorized' },
      },
    },
    delete: {
      tags: ['Goal'],
      summary: 'Delete a family goal',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      responses: {
        '200': { description: 'Goal deleted' },
        '404': { description: 'Goal not found' },
        '401': { description: 'Unauthorized' },
      },
    },
  },
};
