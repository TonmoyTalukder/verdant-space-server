import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './routes';
import notFound from './middleware/notFound';

const app: Application = express();

//parsers
app.use(express.json());

// Handle CORS for requests
const allowedOrigins = ['https://verdantspace.vercel.app', 'http://localhost:3000', 'https://verdant-space.vercel.app'];

app.use(cors({
  origin: allowedOrigins,  // Allow specific domains
  credentials: true,       // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed headers
}));

// Handle preflight requests
app.options('*', cors());

// Application routes
app.use('/api/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express!!!!');
});

// Not found route handler
app.use(notFound);

export default app;
