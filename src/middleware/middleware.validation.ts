import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod'; // Import ZodSchema and ZodError

// Use a generic to ensure proper type inference for Zod schemas
const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body); // Use Zod's safeParse for validation
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message, // Send the first error message from Zod
        errors: parsed.error.errors, // You can also send all errors if necessary
      });
    }
    next();
  };
};

export default validate;
