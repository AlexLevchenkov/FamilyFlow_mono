import { SwaggerOptions } from 'swagger-ui-express';
import { schemas } from './shemas';
import { paths } from './paths';

export const swaggerOptions: SwaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'ToDoProject',
    version: '1.0.0',
    description: 'API documentation for ToDoProject application',
  },
  servers: [
    {
      url: 'http://localhost:' + (process.env.PORT || 5000),
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas,
  },
  paths,
};
