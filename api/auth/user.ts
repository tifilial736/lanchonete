import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthenticated } from '../../lib/auth';
import { storage } from '../../lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await isAuthenticated(req, res, async () => {
      const userId = (req as any).user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}