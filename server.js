/**
 * FRAME — Instagram Integration Server & Official Meta Graph API Proxy
 * 
 * Secure proxy designed for @io.tanmay
 * Features:
 * - Reads credentials strictly from server-side environment variables (.env)
 * - Zero exposure of access tokens to client-side code
 * - Server-side in-memory caching with configurable TTL to respect Meta rate limits (200 requests/hour)
 * - Safe fallback to structured data if credentials are not yet configured or API is unreachable
 * - Supports official Graph API endpoints:
 *     GET /api/instagram/profile
 *     GET /api/instagram/posts
 *     GET /api/instagram/stories (Active 24h stories)
 *     GET /api/instagram/highlights (Local structured highlights source)
 * - Serves static website files (index.html, styles.css, script.js, etc.)
 */

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

// 1. Simple .env file parser (zero-dependency)
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const USER_ID = process.env.INSTAGRAM_USER_ID || '';
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MINUTES || '30', 10) * 60 * 1000;

// Load local fallback data
const fallbackPath = path.join(__dirname, 'data', 'instagram-fallback.json');
function getFallbackData() {
  try {
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch (err) {
    console.error('[FRAME Server] Warning: Could not parse instagram-fallback.json:', err.message);
  }
  return { profile: {}, stories: [], highlights: [], posts: [] };
}

// In-memory cache store
const cache = {
  profile: { data: null, expiresAt: 0 },
  posts: { data: null, expiresAt: 0 },
  stories: { data: null, expiresAt: 0 }
};

// Generic HTTPS request helper for Meta Graph API
function fetchFromMeta(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://graph.facebook.com/v21.0/${endpoint}`;
    https.get(url, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Fetch Profile from Official Graph API with caching
async function getProfile() {
  const now = Date.now();
  if (cache.profile.data && cache.profile.expiresAt > now) {
    return cache.profile.data;
  }

  const fbProfile = getFallbackData().profile;

  if (!ACCESS_TOKEN || !USER_ID) {
    return { ...fbProfile, is_live_api: false, note: 'Running in curated fallback mode. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in .env for live API.' };
  }

  try {
    const fields = 'id,username,name,biography,profile_picture_url,followers_count,media_count';
    const data = await fetchFromMeta(`${USER_ID}?fields=${fields}&access_token=${ACCESS_TOKEN}`);
    const formatted = {
      id: data.id,
      username: data.username || 'io.tanmay',
      name: data.name || 'Tanmay Chavan',
      biography: data.biography || fbProfile.biography,
      profile_picture_url: data.profile_picture_url || fbProfile.profile_picture_url,
      followers_count: data.followers_count || fbProfile.followers_count,
      media_count: data.media_count || fbProfile.media_count,
      profile_url: `https://instagram.com/${data.username || 'io.tanmay'}`,
      is_live_api: true
    };
    cache.profile = { data: formatted, expiresAt: now + CACHE_TTL_MS };
    return formatted;
  } catch (err) {
    console.warn('[FRAME Server] Live Profile fetch failed, using fallback:', err.message);
    return { ...fbProfile, is_live_api: false, api_error: err.message };
  }
}

// Fetch Posts from Official Graph API with caching
async function getPosts() {
  const now = Date.now();
  if (cache.posts.data && cache.posts.expiresAt > now) {
    return cache.posts.data;
  }

  if (!ACCESS_TOKEN || !USER_ID) {
    return { posts: getFallbackData().posts, is_live_api: false };
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}';
    const data = await fetchFromMeta(`${USER_ID}/media?fields=${fields}&limit=12&access_token=${ACCESS_TOKEN}`);
    const posts = (data.data || []).map(p => ({
      id: p.id,
      caption: p.caption || '',
      media_type: p.media_type,
      media_url: p.media_url || p.thumbnail_url,
      thumbnail_url: p.thumbnail_url || p.media_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      children: p.children ? p.children.data : [],
      tag: p.media_type === 'VIDEO' ? 'REEL' : (p.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : 'FRAME')
    }));

    const result = { posts, is_live_api: true };
    cache.posts = { data: result, expiresAt: now + CACHE_TTL_MS };
    return result;
  } catch (err) {
    console.warn('[FRAME Server] Live Posts fetch failed, using fallback:', err.message);
    return { posts: getFallbackData().posts, is_live_api: false, api_error: err.message };
  }
}

// Fetch Active Stories (Strict 24h window) from Official Graph API
async function getStories() {
  const now = Date.now();
  if (cache.stories.data && cache.stories.expiresAt > now) {
    return cache.stories.data;
  }

  if (!ACCESS_TOKEN || !USER_ID) {
    return { stories: getFallbackData().stories, is_live_api: false };
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const data = await fetchFromMeta(`${USER_ID}/stories?fields=${fields}&access_token=${ACCESS_TOKEN}`);
    const stories = (data.data || []).map(s => ({
      id: s.id,
      caption: s.caption || '',
      media_type: s.media_type,
      media_url: s.media_url || s.thumbnail_url,
      thumbnail_url: s.thumbnail_url || s.media_url,
      permalink: s.permalink || 'https://instagram.com/stories/io.tanmay/',
      timestamp: s.timestamp
    }));

    // If no active stories in last 24h from API, return empty or fallback gracefully
    const result = { stories: stories.length > 0 ? stories : getFallbackData().stories, is_live_api: true, active_count: stories.length };
    cache.stories = { data: result, expiresAt: now + (10 * 60 * 1000) }; // 10 min cache for stories
    return result;
  } catch (err) {
    console.warn('[FRAME Server] Live Stories fetch failed, using fallback:', err.message);
    return { stories: getFallbackData().stories, is_live_api: false, api_error: err.message };
  }
}

// Highlights: Official API does not offer a highlights endpoint.
// Return structured local data as required by the spec.
function getHighlights() {
  return {
    highlights: getFallbackData().highlights,
    is_official_api_supported: false,
    note: "Meta's Instagram Graph API does not provide an official endpoint for Highlights. Maintained via local structured data."
  };
}

// Static MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp'
};

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // JSON helper
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60'
    });
    res.end(JSON.stringify(data, null, 2));
  };

  // API Endpoints
  if (pathname === '/api/instagram/profile') {
    const profile = await getProfile();
    return sendJSON(200, profile);
  }

  if (pathname === '/api/instagram/posts') {
    const posts = await getPosts();
    return sendJSON(200, posts);
  }

  if (pathname === '/api/instagram/stories') {
    const stories = await getStories();
    return sendJSON(200, stories);
  }

  if (pathname === '/api/instagram/highlights') {
    const highlights = getHighlights();
    return sendJSON(200, highlights);
  }

  // Fallback combined feed
  if (pathname === '/api/instagram/all') {
    const [profile, posts, stories] = await Promise.all([getProfile(), getPosts(), getStories()]);
    const highlights = getHighlights();
    return sendJSON(200, { profile, posts, stories, highlights });
  }

  // Static file serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(normalized, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const ext = path.extname(normalized).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(normalized).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎬 FRAME — Portfolio Server with Instagram Integration`);
  console.log(`🌐 Server running at: http://localhost:${PORT}/`);
  console.log(`📸 Target Instagram Account: @io.tanmay`);
  console.log(`🔐 Meta Graph API Status: ${ACCESS_TOKEN ? 'LIVE TOKEN CONFIGURED' : 'LOCAL FALLBACK MODE (Configure .env for live)'}`);
  console.log(`======================================================\n`);
});
