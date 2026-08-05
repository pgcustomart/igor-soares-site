/**
 * One-time migration: reads the existing hand-written static HTML
 * (index.html, artigos/index.html, artigos/<slug>/index.html) and loads the
 * exact same real content into Postgres via Prisma. No values are invented —
 * anything that was a placeholder in the static files stays a placeholder
 * in the DB (e.g. OAB "a confirmar", phone/email as currently published).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const ROOT = path.join(__dirname, '..', '..');

function readHtml(relPath) {
  return cheerio.load(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function toAbsolute(src) {
  if (!src) return '';
  return '/' + src.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
}

function jsonLdByType($, type) {
  let found = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      if (data['@type'] === type) found = data;
    } catch (e) {
      // ignore malformed blocks
    }
  });
  return found;
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

async function migrateHome() {
  const $ = readHtml('index.html');
  const body = $('body');

  const whatsapp = body.attr('data-whatsapp') || '';
  const phone = cleanText($('.contato__alt a[href^="tel:"]').first().text());
  const email = cleanText($('.contato__alt a[href^="mailto:"]').first().text());
  const attorney = jsonLdByType($, 'Attorney');
  const address = attorney?.address?.streetAddress || '';
  const oab = cleanText($('.footer-bottom span').first().text());
  const mapaRows = $('.mapa__card-row');
  const hoursHtml = mapaRows.eq(1).find('p').first().html() || '';
  const hoursText = cleanText(hoursHtml.replace(/<br\s*\/?>/gi, ', '));
  const googleMapsUrl = $('.mapa__frame iframe').attr('src') || '';

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1, phone, whatsapp, email, address, addressComplement: '', hours: hoursText,
      instagram: '', linkedin: '', googleMapsUrl, oab,
    },
    update: { phone, whatsapp, email, address, hours: hoursText, googleMapsUrl, oab },
  });

  const heroTitle = $('#hero h1').first().html().trim();
  const heroSubtitle = cleanText($('#hero .hero__lead').first().text());
  const heroDesktop = toAbsolute($('#hero picture img').attr('src'));
  const heroMobile = toAbsolute($('#hero picture source').attr('srcset'));
  const waBtn = $('#hero .btn--primary.js-whatsapp');
  const scheduleBtn = $('#hero .btn--outline-gold.js-whatsapp');

  await prisma.homeHero.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      title: heroTitle,
      subtitle: heroSubtitle,
      desktopImage: heroDesktop,
      mobileImage: heroMobile,
      whatsappLabel: cleanText(waBtn.clone().children('svg').remove().end().text()),
      whatsappMessage: waBtn.attr('data-wa-message') || '',
      scheduleLabel: cleanText(scheduleBtn.text()),
      scheduleMessage: scheduleBtn.attr('data-wa-message') || '',
    },
    update: {
      title: heroTitle,
      subtitle: heroSubtitle,
      desktopImage: heroDesktop,
      mobileImage: heroMobile,
      whatsappLabel: cleanText(waBtn.clone().children('svg').remove().end().text()),
      whatsappMessage: waBtn.attr('data-wa-message') || '',
      scheduleLabel: cleanText(scheduleBtn.text()),
      scheduleMessage: scheduleBtn.attr('data-wa-message') || '',
    },
  });

  const homeTitle = cleanText($('title').text());
  const homeDescription = $('meta[name="description"]').attr('content') || '';
  const homeOgImage = $('meta[property="og:image"]').attr('content') || '';

  await prisma.seoSettings.upsert({
    where: { id: 1 },
    create: { id: 1, homeTitle, homeDescription, homeOgImage },
    update: { homeTitle, homeDescription, homeOgImage },
  });

  console.log('✓ Home (settings, hero, seo) migrated');
}

async function migrateArticlesHub() {
  const $ = readHtml('artigos/index.html');

  const heroTitle = cleanText($('#hero h1').first().text());
  const heroDescription = cleanText($('#hero .hero__lead').first().text());
  const heroDesktop = toAbsolute($('#hero picture img').attr('src'));
  const heroMobile = toAbsolute($('#hero picture source').attr('srcset'));

  await prisma.articlesHero.upsert({
    where: { id: 1 },
    create: { id: 1, title: heroTitle, description: heroDescription, desktopImage: heroDesktop, mobileImage: heroMobile },
    update: { title: heroTitle, description: heroDescription, desktopImage: heroDesktop, mobileImage: heroMobile },
  });

  const articlesMetaTitle = cleanText($('title').text());
  const articlesMetaDescription = $('meta[name="description"]').attr('content') || '';
  const articlesCanonical = $('link[rel="canonical"]').attr('href') || '';
  const articlesRobots = $('meta[name="robots"]').attr('content') || 'index, follow';

  const settings = await prisma.seoSettings.findUnique({ where: { id: 1 } });
  await prisma.seoSettings.update({
    where: { id: 1 },
    data: { articlesMetaTitle, articlesMetaDescription, articlesCanonical, articlesRobots },
  });

  console.log('✓ Articles hub (hero, seo) migrated');
}

async function migrateArticle(slug) {
  const $ = readHtml(`artigos/${slug}/index.html`);

  const title = cleanText($('.artigo-header h1').first().text());
  const category = cleanText($('.artigo-meta__categoria').first().text());
  const readingMatch = $('.artigo-meta__item').first().text().match(/\d+/);
  const readingTimeMin = readingMatch ? parseInt(readingMatch[0], 10) : 5;
  const excerpt = cleanText($('.artigo-header .lead').first().text());
  const coverImg = $('.artigo-cover img').first();
  const coverImage = toAbsolute(coverImg.attr('src'));
  const coverImageAlt = coverImg.attr('alt') || '';
  const bodyHtml = $('.artigo-body').first().html().trim();
  const ctaTitle = cleanText($('.artigo-cta h2').first().text());
  const ctaText = cleanText($('.artigo-cta p').first().text());

  const seoTitle = cleanText($('title').text());
  const seoDescription = $('meta[name="description"]').attr('content') || '';
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
  const robots = $('meta[name="robots"]').attr('content') || 'index, follow';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';

  const articleLd = jsonLdByType($, 'Article');
  const publishedAt = articleLd?.datePublished ? new Date(articleLd.datePublished) : new Date();
  const updatedAt = articleLd?.dateModified ? new Date(articleLd.dateModified) : publishedAt;

  const faqs = [];
  $('.artigo-faq .faq-item').each((_, el) => {
    const $el = $(el);
    const question = cleanText($el.find('.faq-item__trigger').text());
    const answer = cleanText($el.find('.faq-item__panel-inner p').first().text());
    if (question && answer) faqs.push({ question, answer });
  });

  const relatedSlugs = [];
  $('.artigo-relacionados .article-card__link').each((_, el) => {
    const href = $(el).attr('href') || '';
    const match = href.match(/([^/]+)\/?$/);
    if (match) relatedSlugs.push(match[1]);
  });

  const data = {
    title, category, excerpt, coverImage, coverImageAlt, readingTimeMin, bodyHtml,
    status: 'PUBLISHED', publishedAt, seoTitle, seoDescription, canonicalUrl, robots, ogImage,
    ctaTitle, ctaText,
  };

  const article = await prisma.article.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });

  // updatedAt is @updatedAt-managed by Prisma on write; force it to match the
  // original dateModified from the static page so history isn't rewritten.
  await prisma.article.update({ where: { id: article.id }, data: { updatedAt } });

  await prisma.articleFaq.deleteMany({ where: { articleId: article.id } });
  if (faqs.length) {
    await prisma.articleFaq.createMany({
      data: faqs.map((f, i) => ({ articleId: article.id, question: f.question, answer: f.answer, order: i })),
    });
  }

  console.log(`✓ Article migrated: ${slug} (${faqs.length} FAQs, ${relatedSlugs.length} related)`);
  return { id: article.id, slug, relatedSlugs };
}

async function main() {
  await migrateHome();
  await migrateArticlesHub();

  const articlesDir = path.join(ROOT, 'artigos');
  const slugs = fs.readdirSync(articlesDir).filter((name) => {
    return fs.statSync(path.join(articlesDir, name)).isDirectory();
  });

  const migrated = [];
  for (const slug of slugs) {
    // eslint-disable-next-line no-await-in-loop
    const result = await migrateArticle(slug);
    migrated.push(result);
  }

  const bySlug = new Map(migrated.map((a) => [a.slug, a.id]));
  for (const article of migrated) {
    const relatedIds = article.relatedSlugs.map((s) => bySlug.get(s)).filter(Boolean);
    if (relatedIds.length) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.articleRelated.deleteMany({ where: { articleId: article.id } });
      // eslint-disable-next-line no-await-in-loop
      await prisma.articleRelated.createMany({
        data: relatedIds.map((relatedArticleId, i) => ({ articleId: article.id, relatedArticleId, order: i })),
      });
    }
  }

  console.log(`\nDone. ${migrated.length} articles migrated.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
