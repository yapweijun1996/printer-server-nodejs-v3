import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import printRoutes from './routes/print.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// --- Basic Setup ---
dotenv.config(); // Load environment variables from .env file

// --- Initialize Express App ---
const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Enable support for large JSON payloads

// --- API Routes ---
app.get('/', (req, res) => res.send('Node.js Print Server is running!'));
app.use('/api', printRoutes);

// --- Error Handling ---
// This must be the last piece of middleware loaded
app.use(errorHandler);

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Node.js Print Server listening at http://localhost:${port}`);
    console.log('Endpoints available:');
    console.log('  - GET /api/printers');
    console.log('  - POST /api/print-html (High Quality, Selectable Text)');
    console.log('  - POST /api/print-base64 (Lower Quality, Image-based)');
});
