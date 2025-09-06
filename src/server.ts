import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = process.env['PORT'] || 3000;

const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'];

if (!ADMIN_PASSWORD) {
  console.error("FATAL ERROR: ADMIN_PASSWORD environment variable is not set.");
  process.exit(1);
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

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  if (clientOrigin) {
    console.log(`Accepting requests from origin: ${clientOrigin}`);
  } else {
    console.warn(`Warning: CLIENT_ORIGIN is not set. CORS may block requests.`);
  }
  console.log("Reminder: For production, run this server behind a reverse proxy (like Nginx) to handle HTTPS.");
});
