require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generatePassword() {
  return crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12);
}

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists (${email}) — skipping credential creation.`);
  } else {
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, name, passwordHash, role: 'ADMIN' } });
    console.log('=== Admin user created ===');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('Save this password now — it will not be shown again.');
  }

  // Ensure the singleton content rows exist so the public site + admin
  // panel never hit a missing-row edge case before the first real edit.
  await prisma.siteSettings.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
  await prisma.homeHero.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
  await prisma.articlesHero.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
  await prisma.seoSettings.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
