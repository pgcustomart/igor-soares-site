const express = require('express');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { verifyCredentials } = require('../services/auth.service');
const { signSession } = require('../lib/jwt');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_attempts' },
});

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'missing_credentials' });
  }
  const user = await verifyCredentials(email, password);
  if (!user) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  const token = signSession(user);
  res.cookie(env.cookieName, token, cookieOptions);
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  return res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.sub, email: req.user.email, name: req.user.name, role: req.user.role } });
});

module.exports = router;
