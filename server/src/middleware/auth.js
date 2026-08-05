const env = require('../config/env');
const { verifySession } = require('../lib/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies?.[env.cookieName];
  if (!token) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  try {
    req.user = verifySession(token);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_session' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
