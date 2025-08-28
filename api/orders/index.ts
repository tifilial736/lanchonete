import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthenticated } from '../../lib/auth';
import { storage } from '../../lib/storage';
import { orderWithItemsSchema } from '../../lib/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      try {
        const orderData = orderWithItemsSchema.parse(req.body);
        const order = await storage.createOrder(orderData);
        res.status(201).json(order);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: "Validation error", errors: error.errors });
          return;
        }
        throw error;
      }
      return;
    }

    if (req.method === 'GET') {
      await isAuthenticated(req, res, async () => {
        const orders = await storage.getOrdersWithItems();
        res.json(orders);
      });
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Error in orders API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}