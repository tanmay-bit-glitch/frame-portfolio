const { getProfile, sendJSON } = require('../_helpers');

module.exports = async function handler(req, res) {
  const data = await getProfile();
  sendJSON(res, 200, data);
};
