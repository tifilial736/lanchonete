import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { category } = req.query;

  if (typeof category !== 'string') {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}