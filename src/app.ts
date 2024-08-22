import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './routes';
import notFound from './middleware/notFound';

const app: Application = express();

//parsers
app.use(express.json());

app.use(cors({ origin: ['http://localhost:3000'] }));

// application routes
app.use('/api/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express!!!!');
});

// Not found route handler
app.use(notFound);

export default app;
