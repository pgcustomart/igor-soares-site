const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signSession(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function verifySession(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { signSession, verifySession };
