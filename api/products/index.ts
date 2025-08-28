import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthenticated } from '../../lib/auth';
import { storage } from '../../lib/storage';
import { insertProductSchema } from '../../lib/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const products = await storage.getProducts();
      return res.json(products);
    }

    if (req.method === 'POST') {
      await isAuthenticated(req, res, async () => {
        try {
          const productData = insertProductSchema.parse(req.body);
          const product = await storage.createProduct(productData);
          res.status(201).json(product);
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

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Error in products API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}