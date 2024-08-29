/* eslint-disable @typescript-eslint/no-explicit-any */
// types/express.d.ts
import 'express';

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[]; // Add type for files
    }
  }
}
