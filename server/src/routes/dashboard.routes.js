const express = require('express');
const { requireAuth } = require('../middleware/auth');
const prisma = require('../db/prisma');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const [published, drafts, recent, lastUpdated] = await Promise.all([
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, status: true, updatedAt: true },
    }),
    prisma.article.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
  ]);

  res.json({
    publishedCount: published,
    draftCount: drafts,
    lastUpdatedAt: lastUpdated?.updatedAt || null,
    recentArticles: recent,
  });
});

module.exports = router;
