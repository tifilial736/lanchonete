import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Redirect to Replit OAuth
  const replitOAuthUrl = `https://replit.com/oauth/authorize?client_id=${process.env.REPL_ID}&response_type=code&redirect_uri=${encodeURIComponent('https://' + req.headers.host + '/api/callback')}`;
  
  res.redirect(302, replitOAuthUrl);
}