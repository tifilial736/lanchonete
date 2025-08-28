import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as client from "openid-client";
import memoize from "memoizee";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export const isAuthenticated = async (
  req: VercelRequest,
  res: VercelResponse,
  next: () => Promise<void>
) => {
  // For Vercel serverless functions, we need to implement a different auth strategy
  // This is a simplified version - in production you'd want proper session management
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Here you would validate the JWT token
    // For now, we'll simulate authentication
    const token = authHeader.split(' ')[1];
    
    // Mock user for development - replace with actual JWT validation
    (req as any).user = {
      claims: {
        sub: 'mock-user-id',
        email: 'admin@snackschicken.com',
        first_name: 'Admin',
        last_name: 'User'
      }
    };

    await next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};