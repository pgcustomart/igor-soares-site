const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');

async function verifyCredentials(email, password) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

module.exports = { verifyCredentials, hashPassword };
