import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthenticated } from '../../lib/auth';
import { storage } from '../../lib/storage';
import { insertProductSchema } from '../../lib/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    if (req.method === 'PUT') {
      await isAuthenticated(req, res, async () => {
        try {
          const productData = insertProductSchema.partial().parse(req.body);
          const product = await storage.updateProduct(id, productData);
          res.json(product);
        } catch (error) {
          if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation error", errors: error.errors });
            return;
          }
          throw error;
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      await isAuthenticated(req, res, async () => {
        await storage.deleteProduct(id);
        res.status(204).end();
      });
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(`Error in product ${id} API:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}