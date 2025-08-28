import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    // Exchange code for token (simplified for demo)
    // In production, you'd exchange the code for an actual token
    
    // Set a simple session cookie (in production, use proper JWT)
    res.setHeader('Set-Cookie', [
      `token=demo-auth-token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    ]);
    
    // Redirect to home page
    res.redirect(302, '/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}