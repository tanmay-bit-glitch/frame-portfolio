const { getStories, sendJSON } = require('../_helpers');

module.exports = async function handler(req, res) {
  const data = await getStories();
  sendJSON(res, 200, data);
};
