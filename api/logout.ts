import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Clear any cookies/session data
  res.setHeader('Set-Cookie', [
    'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
  ]);
  
  // Redirect to home
  res.redirect(302, '/');
}