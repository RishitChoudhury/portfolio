/**
 * One-time script to obtain a Google OAuth2 refresh token.
 * 
 * PREREQUISITES:
 * 1. Go to Google Cloud Console → APIs & Services → Credentials
 * 2. Create an OAuth 2.0 Client ID (type: Web application)
 * 3. Add "http://localhost:3333/callback" as an Authorized Redirect URI
 * 4. Copy the Client ID and Client Secret
 * 
 * USAGE:
 *   GOOGLE_OAUTH_CLIENT_ID=xxx GOOGLE_OAUTH_CLIENT_SECRET=yyy node scripts/get-refresh-token.js
 * 
 * This will open your browser, ask you to sign in with your Google account,
 * and print the refresh token to the console. Store it as GOOGLE_OAUTH_REFRESH_TOKEN.
 */

import { google } from 'googleapis';
import http from 'http';
import { URL } from 'url';

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3333/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n❌ Missing env vars. Run with:\n');
    console.error('  GOOGLE_OAUTH_CLIENT_ID=xxx GOOGLE_OAUTH_CLIENT_SECRET=yyy node scripts/get-refresh-token.js\n');
    process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent', // Forces refresh token generation
});

console.log('\n🔗 Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n⏳ Waiting for authorization...\n');

// Start a temporary server to catch the OAuth callback
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:3333`);
    
    if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        
        if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>❌ No authorization code received</h1>');
            return;
        }

        try {
            const { tokens } = await oauth2Client.getToken(code);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <div style="font-family: monospace; background: #0a0a0a; color: #00ff88; padding: 40px; min-height: 100vh;">
                    <h1>✅ Authorization Successful!</h1>
                    <p>Check your terminal for the refresh token.</p>
                    <p style="color: #888;">You can close this tab.</p>
                </div>
            `);

            console.log('✅ Authorization successful!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n📋 Add this to your .env file AND Vercel environment variables.\n');
            
            server.close();
            process.exit(0);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<h1>❌ Error: ${err.message}</h1>`);
            console.error('Token exchange failed:', err.message);
        }
    }
});

server.listen(3333, () => {
    // Try to open the browser automatically
    import('child_process').then(({ exec }) => {
        const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${cmd} "${authUrl}"`);
    });
});
