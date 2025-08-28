import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthenticated } from '../../../lib/auth';
import { storage } from '../../../lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    await isAuthenticated(req, res, async () => {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}