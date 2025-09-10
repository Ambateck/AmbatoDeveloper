import * as functions from 'firebase-functions';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// --- Configuration and Setup ---

const app = express();
// const port = process.env['PORT'] || 3000;

// --- Security Best Practices ---

const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'];

if (!ADMIN_PASSWORD) {
  console.error("FATAL ERROR: ADMIN_PASSWORD environment variable is not set.");
  throw new Error("ADMIN_PASSWORD environment variable is not set.");
}

const clientOrigin = process.env['CLIENT_ORIGIN'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || (clientOrigin && origin === clientOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// --- Middlewares ---

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API Endpoints ---

app.post('/api/validate-password', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
});

// --- Server Activation ---
export const api = functions.https.onRequest(app);

