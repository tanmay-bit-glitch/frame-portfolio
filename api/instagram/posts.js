const { getPosts, sendJSON } = require('../_helpers');

module.exports = async function handler(req, res) {
  const data = await getPosts();
  sendJSON(res, 200, data);
};
