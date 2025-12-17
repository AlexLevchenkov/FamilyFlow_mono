import '@cron/cleanupTokens';
import swaggerUi from 'swagger-ui-express';
import setupRoutes from '@routes/routes';
import app from '@config/express';
import { errorHandler } from '@middleware/error';
import { swaggerOptions } from '@config/swagger';

const PORT = process.env.PORT || 3000;

// Setup routes
setupRoutes(app);

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

const startServer = async (): Promise<void> => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

app.use(errorHandler)

startServer();