const { getProfile, getPosts, getStories, getFallbackData, sendJSON } = require('../_helpers');

module.exports = async function handler(req, res) {
  const [profile, postsData, storiesData] = await Promise.all([
    getProfile(),
    getPosts(),
    getStories()
  ]);
  const highlights = {
    highlights: getFallbackData().highlights,
    is_official_api_supported: false
  };
  sendJSON(res, 200, { profile, posts: postsData, stories: storiesData, highlights });
};
