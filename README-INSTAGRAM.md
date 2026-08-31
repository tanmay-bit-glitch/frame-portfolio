# Official Instagram Integration Guide for `@io.tanmay`

This document details the exact technical prerequisites, Meta Developer setup, official API limits, and operational procedures for integrating the real Instagram account **`@io.tanmay`** into the **FRAME** portfolio.

---

## 1. Executive Summary & Feasibility Matrix

| Feature | Official Support | Endpoint Used | Technical Limitation / Explanation |
| :--- | :--- | :--- | :--- |
| **Profile Info** | ✅ Fully Supported | `GET /{ig-user-id}` | Returns username, name, bio, follower count, media count. |
| **Latest Posts** | ✅ Fully Supported | `GET /{ig-user-id}/media` | Returns single images, multi-image carousels, and video stills. |
| **Reels / Videos** | ✅ Fully Supported | Included in media endpoint | Returns video stream URL (`media_url`) and cover thumbnail (`thumbnail_url`). |
| **Active Stories** | ✅ Supported | `GET /{ig-user-id}/stories` | **Strict 24-hour expiration.** Once a story expires on Instagram, it vanishes from the API. If no stories are live, an empty list is returned. |
| **Story Highlights** | ❌ **NOT Supported** | **None** | Meta's official Graph API **does not expose** an endpoint for Highlights. Scraping is blocked by policy and unstable. Highlights are therefore powered by a structured, API-compliant local file (`data/instagram-fallback.json`), which you can edit at any time. |

---

## 2. Mandatory Account Prerequisite: Creator or Business Account

> [!IMPORTANT]
> **Why Personal Accounts Cannot Be Used:**  
> On **December 4, 2024**, Meta officially shut down and retired the *Instagram Basic Display API*. Any public API integration now requires an **Instagram Professional Account (Creator or Business)** connected to a Meta App. Personal Instagram accounts have zero developer API access.

### How to Convert `@io.tanmay` to a Creator Account (Free, takes 30 seconds):
1. Open the Instagram app on your mobile device and navigate to your profile (`@io.tanmay`).
2. Tap the **hamburger menu (☰)** in the top right → **Settings and privacy**.
3. Scroll to **Account type and tools** → Tap **Switch to professional account**.
4. Select **Creator** (ideal for photographers, videographers, and visual artists).
5. Choose your category (e.g. *Photographer*, *Artist*, or *Video Creator*).
6. Complete the prompt. (Optionally link to a Facebook Page; having an associated Facebook Page simplifies Meta App permissions).

---

## 3. Meta Developer App Configuration

To generate your official tokens:

### Step 1: Create a Meta Developer Account & App
1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with the Facebook account linked to `@io.tanmay`.
2. Click **My Apps** → **Create App**.
3. Select **Other** (or **Business**) as the app type → Click **Next**.
4. App Type: choose **Business**.
5. Give your app a name (e.g. `Frame Portfolio Integration`) and enter your email address.
6. Click **Create app**.

### Step 2: Add Instagram Graph API
1. In your App Dashboard, find **Instagram Graph API** and click **Set Up**.
2. Go to **Tools** → **Graph API Explorer** in the top navigation.
3. In the right panel under **Meta App**, select your newly created app.
4. Under **User or Page**, select your Instagram Business/Creator Account.
5. Under **Permissions**, add:
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
6. Click **Generate Access Token** and approve the permissions on Facebook/Instagram.

### Step 3: Exchange for a 60-Day Long-Lived Token
Short-lived tokens expire after 1 hour. Generate a 60-day token using Meta's Access Token Tool:
1. Go to [developers.facebook.com/tools/accesstoken/](https://developers.facebook.com/tools/accesstoken/).
2. Find your User Token and click **Debug**.
3. Click **Extend Access Token** at the bottom.
4. Copy the resulting Long-Lived User Access Token.

### Step 4: Find Your Instagram User ID
In the Graph API Explorer, run:
```http
GET https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account{id,username}
```
Note down the numeric `id` corresponding to `@io.tanmay`.

---

## 4. Configuring the Website Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your credentials:
   ```env
   INSTAGRAM_ACCESS_TOKEN=EAAG...your_long_lived_token...
   INSTAGRAM_USER_ID=17841400000000000
   PORT=3000
   CACHE_TTL_MINUTES=30
   ```
3. Start the portfolio server:
   ```bash
   npm start
   ```
4. Visit `http://localhost:3000/`. The site will automatically stream live content directly from `@io.tanmay` while maintaining security and caching.

---

## 5. Security & Rate-Limiting Architecture

1. **Zero Client-Side Token Exposure:**  
   The frontend JavaScript (`script.js`) never touches your Access Token. All requests pass through `server.js` (`/api/instagram/*`).
2. **Server-Side In-Memory Cache:**  
   Meta limits requests to 200 calls per user per hour. The server caches profile, posts, and story results for 30 minutes in memory. This ensures high-speed page loads (<50ms) and eliminates rate-limiting risks.
3. **Curated Fallback System:**  
   If your token expires or the server is deployed to a static host (e.g. GitHub Pages) where `.env` is absent, the frontend automatically falls back to `data/instagram-fallback.json`. Visitors will always experience a rich, fast, unbroken portfolio.
