import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import printRoutes from './routes/print.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './config/logger.js';

// --- Basic Setup ---
dotenv.config(); // Load environment variables from .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize Express App ---
const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Enable support for large JSON payloads

// --- Serve Static UI ---
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// --- API Routes ---
app.use('/api', printRoutes);

// --- Error Handling ---
// This must be the last piece of middleware loaded
app.use(errorHandler);

// --- Start the Server ---
app.listen(port, () => {
    logger.info(`Node.js Print Server listening at http://localhost:${port}`);
    logger.info('Endpoints available:');
    logger.info('  - GET /api/printers');
    logger.info('  - POST /api/print-html (High Quality, Selectable Text)');
    logger.info('  - POST /api/print-base64 (Lower Quality, Image-based)');
});
