const express = require('express');
const { requireAuth } = require('../middleware/auth');
const svc = require('../services/articles.service');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { search, status } = req.query;
  const articles = await svc.listArticles({ search, status });
  res.json({ articles });
});

router.get('/:id', async (req, res) => {
  const article = await svc.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'not_found' });
  res.json({ article });
});

router.post('/', async (req, res, next) => {
  try {
    const article = await svc.createArticle(req.body);
    res.status(201).json({ article });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const article = await svc.updateArticle(req.params.id, req.body);
    res.json({ article });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await svc.deleteArticle(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const article = await svc.duplicateArticle(req.params.id);
    if (!article) return res.status(404).json({ error: 'not_found' });
    res.status(201).json({ article });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', async (req, res, next) => {
  try {
    const article = await svc.setStatus(req.params.id, 'PUBLISHED');
    res.json({ article });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/unpublish', async (req, res, next) => {
  try {
    const article = await svc.setStatus(req.params.id, 'DRAFT');
    res.json({ article });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
