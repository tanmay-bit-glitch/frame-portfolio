/**
 * FRAME — Instagram API Shared Helper
 * Reusable utilities for all /api/instagram/* serverless functions
 */

const https = require('node:https');
const path = require('node:path');
const fs = require('node:fs');

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const USER_ID = process.env.INSTAGRAM_USER_ID || '';

// Load fallback JSON (bundled with deployment)
function getFallbackData() {
  try {
    const fallbackPath = path.join(process.cwd(), 'data', 'instagram-fallback.json');
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch (err) {
    console.error('[FRAME] Could not load fallback:', err.message);
  }
  return { profile: {}, stories: [], highlights: [], posts: [] };
}

// Generic HTTPS fetch from Meta Graph API
function fetchFromMeta(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://graph.facebook.com/v21.0/${endpoint}`;
    https.get(url, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}`));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// Send CORS-enabled JSON response
function sendJSON(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  res.status(statusCode).json(data);
}

async function getProfile() {
  const fallback = getFallbackData().profile;
  if (!ACCESS_TOKEN || !USER_ID) {
    return { ...fallback, is_live_api: false, note: 'Running in curated fallback mode.' };
  }
  try {
    const fields = 'id,username,name,biography,profile_picture_url,followers_count,media_count';
    const data = await fetchFromMeta(`${USER_ID}?fields=${fields}&access_token=${ACCESS_TOKEN}`);
    return {
      id: data.id,
      username: data.username || 'io.tanmay',
      name: data.name || 'Tanmay',
      biography: data.biography || fallback.biography,
      profile_picture_url: data.profile_picture_url || fallback.profile_picture_url,
      followers_count: data.followers_count || fallback.followers_count,
      media_count: data.media_count || fallback.media_count,
      profile_url: `https://instagram.com/${data.username || 'io.tanmay'}`,
      is_live_api: true
    };
  } catch (err) {
    return { ...fallback, is_live_api: false, api_error: err.message };
  }
}

async function getPosts() {
  if (!ACCESS_TOKEN || !USER_ID) {
    return { posts: getFallbackData().posts, is_live_api: false };
  }
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const data = await fetchFromMeta(`${USER_ID}/media?fields=${fields}&limit=12&access_token=${ACCESS_TOKEN}`);
    const posts = (data.data || []).map(p => ({
      id: p.id,
      caption: p.caption || '',
      media_type: p.media_type,
      media_url: p.media_url || p.thumbnail_url,
      thumbnail_url: p.thumbnail_url || p.media_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      tag: p.media_type === 'VIDEO' ? 'REEL' : (p.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : 'FRAME')
    }));
    return { posts, is_live_api: true };
  } catch (err) {
    return { posts: getFallbackData().posts, is_live_api: false, api_error: err.message };
  }
}

async function getStories() {
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
      permalink: s.permalink || 'https://instagram.com/stories/io.tanmay/',
      timestamp: s.timestamp
    }));
    return { stories: stories.length > 0 ? stories : getFallbackData().stories, is_live_api: true, active_count: stories.length };
  } catch (err) {
    return { stories: getFallbackData().stories, is_live_api: false, api_error: err.message };
  }
}

module.exports = { getFallbackData, getProfile, getPosts, getStories, sendJSON };
