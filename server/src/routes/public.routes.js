const express = require('express');
const env = require('../config/env');
const content = require('../services/siteContent.service');
const articlesSvc = require('../services/articles.service');
const { extractHeadings } = require('../lib/articleBody');
const { attorneyJsonLd, faqPageJsonLd, articleJsonLd, breadcrumbJsonLd } = require('../lib/jsonld');

const router = express.Router();

const HOME_FAQS = [
  { question: 'Quanto tempo tenho para entrar com uma ação trabalhista?', answer: 'O prazo prescricional, em regra, é de dois anos a contar do fim do contrato de trabalho, para reivindicar direitos referentes aos últimos cinco anos da relação. Particularidades do caso concreto podem alterar essa contagem, por isso a análise deve ocorrer o quanto antes.' },
  { question: 'Preciso ir até o escritório para o primeiro atendimento?', answer: 'Não. O primeiro contato ocorre pelo WhatsApp. Quando o aprofundamento do caso exige, uma reunião por vídeo ou presencial é agendada conforme a preferência do cliente.' },
  { question: 'Como funcionam os honorários?', answer: 'Os valores e a forma de pagamento são definidos após a análise do caso e apresentados com clareza antes de qualquer decisão do cliente.' },
  { question: 'Meu caso tem chance de sucesso?', answer: 'Cada processo tem particularidades próprias. Uma análise honesta do caso é sempre preferível a promessas antecipadas. Por isso, a conversa inicial é o caminho mais adequado para entender as possibilidades reais da situação.' },
  { question: 'O atendimento é só para quem mora no Rio de Janeiro?', answer: 'O primeiro contato pode partir de qualquer lugar, pelo WhatsApp. A necessidade de reunião presencial é avaliada conforme as circunstâncias de cada caso.' },
];

router.get('/', async (req, res, next) => {
  try {
    const [settings, hero, seo, latestArticles] = await Promise.all([
      content.siteSettings.get(),
      content.homeHero.get(),
      content.seoSettings.get(),
      articlesSvc.listPublishedArticles({ take: 3 }),
    ]);

    res.render('pages/home', {
      settings,
      hero,
      latestArticles,
      seo: {
        title: seo.homeTitle || 'Igor Soares Advogado | Direito do Trabalho',
        description: seo.homeDescription || 'Advogado atuante em Direito do Trabalho, com acompanhamento direto em cada etapa do processo. Primeiro contato pelo WhatsApp.',
        ogImage: seo.homeOgImage || `${env.siteUrl}/assets/images/og/cover.jpg`,
      },
      siteUrl: env.siteUrl,
      attorneyJsonLd: attorneyJsonLd(settings),
      faqJsonLd: faqPageJsonLd(HOME_FAQS),
    });
  } catch (err) {
    next(err);
  }
});

router.get(['/artigos', '/artigos/'], async (req, res, next) => {
  try {
    const [settings, hero, seo, articles] = await Promise.all([
      content.siteSettings.get(),
      content.articlesHero.get(),
      content.seoSettings.get(),
      articlesSvc.listPublishedArticles(),
    ]);

    res.render('pages/artigos-hub', {
      settings,
      hero,
      articles,
      seo: {
        title: seo.articlesMetaTitle || 'Biblioteca Jurídica | Artigos sobre Direito do Trabalho | Igor Soares Advogado',
        description: seo.articlesMetaDescription || 'Artigos sobre Direito do Trabalho escritos por um advogado especialista.',
        canonical: seo.articlesCanonical || `${env.siteUrl}/artigos/`,
        robots: seo.articlesRobots,
        ogImage: seo.homeOgImage || `${env.siteUrl}/assets/images/og/cover.jpg`,
      },
      breadcrumbJsonLd: breadcrumbJsonLd([
        { name: 'Início', url: `${env.siteUrl}/` },
        { name: 'Artigos', url: `${env.siteUrl}/artigos/` },
      ]),
    });
  } catch (err) {
    next(err);
  }
});

router.get(['/artigos/:slug', '/artigos/:slug/'], async (req, res, next) => {
  try {
    const article = await articlesSvc.getPublicArticleBySlug(req.params.slug);
    if (!article) return res.status(404).render('pages/404', { siteUrl: env.siteUrl });

    const settings = await content.siteSettings.get();
    const { html, headings } = extractHeadings(article.bodyHtml);
    article.bodyHtml = html;

    const waMessage = `Olá, Dr. Igor. Li o artigo sobre ${article.title.toLowerCase()} e gostaria de falar sobre o meu caso.`;
    const waScheduleMessage = `Olá, Dr. Igor. Li o artigo sobre ${article.title.toLowerCase()} e gostaria de agendar uma consulta sobre o meu caso.`;

    const publishedDate = article.publishedAt || article.createdAt;

    res.render('pages/artigo', {
      article,
      settings,
      headings,
      waMessage,
      waScheduleMessage,
      publishedIso: publishedDate.toISOString().slice(0, 10),
      publishedDisplay: publishedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      updatedIso: article.updatedAt.toISOString().slice(0, 10),
      updatedDisplay: article.updatedAt.getTime() !== publishedDate.getTime()
        ? article.updatedAt.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
        : null,
      seo: {
        title: article.seoTitle || `${article.title} | Igor Soares Advogado`,
        description: article.seoDescription || article.excerpt,
        canonical: article.canonicalUrl || `${env.siteUrl}/artigos/${article.slug}/`,
        robots: article.robots,
        ogImage: article.ogImage || `${env.siteUrl}${article.coverImage}`,
      },
      articleJsonLd: articleJsonLd(article),
      faqJsonLd: article.faqs.length ? faqPageJsonLd(article.faqs) : null,
      breadcrumbJsonLd: breadcrumbJsonLd([
        { name: 'Início', url: `${env.siteUrl}/` },
        { name: 'Artigos', url: `${env.siteUrl}/artigos/` },
        { name: article.title, url: `${env.siteUrl}/artigos/${article.slug}/` },
      ]),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const articles = await articlesSvc.listPublishedArticles();
    const staticUrls = [`${env.siteUrl}/`, `${env.siteUrl}/artigos/`];
    const urls = [
      ...staticUrls.map((loc) => ({ loc })),
      ...articles.map((a) => ({ loc: `${env.siteUrl}/artigos/${a.slug}/`, lastmod: a.updatedAt.toISOString().slice(0, 10) })),
    ];
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
      .join('\n')}\n</urlset>\n`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
