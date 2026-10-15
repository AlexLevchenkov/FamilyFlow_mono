export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successful login',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        401: {
          description: 'Invalid email or password',
        },
        500: {
          description: 'Failed to generate tokens',
        },
      },
    },
  },
  '/auth/logout': {
    get: {
      tags: ['Auth'],
      summary: 'User logout',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Logged out successfully',
        },
        404: {
          description: 'User not found',
        },
      },
    },
  },
  '/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Token refresh',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'New tokens',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'User not found',
        },
        500: {
          description: 'Failed to generate tokens',
        },
      },
    },
  },
  '/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Init reset password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Sended mail with link',
        },
        404: {
          description: 'User not found',
        },
      },
    },
  },
  '/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Reset password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password is changed',
        },
        401: {
          description: 'Invalid or expired token',
        },
      },
    },
  },
  '/auth/verify-email': {
    get: {
      tags: ['Auth'],
      summary: 'Verify email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/EmailVerifyRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email is verified',
        },
        401: {
          description: 'Invalid or expired token',
        },
      },
    },
  },
};
