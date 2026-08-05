const express = require('express');
const { requireAuth } = require('../middleware/auth');
const content = require('../services/siteContent.service');

function singletonRouter(handler) {
  const router = express.Router();
  router.use(requireAuth);
  router.get('/', async (req, res) => {
    res.json({ data: await handler.get() });
  });
  router.put('/', async (req, res, next) => {
    try {
      res.json({ data: await handler.update(req.body) });
    } catch (err) {
      next(err);
    }
  });
  return router;
}

module.exports = {
  settingsRouter: singletonRouter(content.siteSettings),
  homeHeroRouter: singletonRouter(content.homeHero),
  articlesHeroRouter: singletonRouter(content.articlesHero),
  seoRouter: singletonRouter(content.seoSettings),
};
