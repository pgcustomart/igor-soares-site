const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const articlesRoutes = require('./routes/articles.routes');
const imagesRoutes = require('./routes/images.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { settingsRouter, homeHeroRouter, articlesHeroRouter, seoRouter } = require('./routes/siteContent.routes');
const publicRoutes = require('./routes/public.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const ADMIN_DIST = path.join(__dirname, '..', 'admin-dist');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Static assets that already exist in the repo (css/js/assets/manifest) —
// unchanged from the pre-admin static site.
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'assets')));
app.use('/css', express.static(path.join(PROJECT_ROOT, 'css')));
app.use('/js', express.static(path.join(PROJECT_ROOT, 'js')));
app.use('/site.webmanifest', express.static(path.join(PROJECT_ROOT, 'site.webmanifest')));
app.use('/robots.txt', express.static(path.join(PROJECT_ROOT, 'robots.txt')));

// Admin-uploaded media (cover images, hero images, general library).
app.use('/uploads', express.static(UPLOADS_DIR));

// API
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRouter);
app.use('/api/hero/home', homeHeroRouter);
app.use('/api/hero/articles', articlesHeroRouter);
app.use('/api/seo', seoRouter);
app.use('/api', notFound);

// Admin SPA (built by admin-app's `npm run build`, output copied/pointed to admin-dist)
app.use('/admin', express.static(ADMIN_DIST));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(ADMIN_DIST, 'index.html'));
});

// Public, DB-driven site (home, articles hub, article detail, sitemap)
app.use('/', publicRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { siteUrl: env.siteUrl });
});

app.use(errorHandler);

module.exports = app;
