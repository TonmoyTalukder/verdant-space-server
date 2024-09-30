import cors from 'cors';
import express, { Application, Request, Response } from 'express';
// import path from 'path';
import router from './routes';
import notFound from './middleware/notFound';

const app: Application = express();

// Parsers
app.use(express.json());

// Handle CORS for requests
// const allowedOrigins = ['http://localhost:3000'];
const allowedOrigins = ['https://verdantspace.vercel.app'];
// const allowedOrigins = [
  // 'https://verdantspace.vercel.app', 
  // 'http://localhost:3000', 
  // 'https://verdant-space.vercel.app'
// ];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true,  // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed headers
}));

// Handle preflight requests (OPTIONS method)
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  console.log(`Request made to: ${req.method} ${req.path}`);
  console.log('Request Headers:', req.headers);
  next();
});

// // Serve static files (with CORS headers for images)
// app.use('/static', (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// }, express.static(path.join(__dirname, 'public')));

// Application routes
app.use('/api/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express!!!!');
});

// Not found route handler
app.use(notFound);

export default app;
