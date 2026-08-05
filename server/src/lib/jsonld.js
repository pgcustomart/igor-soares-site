const env = require('../config/env');

function attorneyJsonLd(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: 'Igor Soares',
    url: `${env.siteUrl}/`,
    image: `${env.siteUrl}/assets/images/og/cover.jpg`,
    telephone: `+${settings.whatsapp.replace(/\D/g, '')}`,
    areaServed: 'BR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
    ...(settings.instagram || settings.linkedin
      ? { sameAs: [settings.instagram, settings.linkedin].filter(Boolean) }
      : {}),
    knowsAbout: 'Direito do Trabalho',
  };
}

function faqPageJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

function articleJsonLd(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.ogImage || `${env.siteUrl}${article.coverImage}`,
    author: { '@type': 'Person', name: 'Igor Soares', jobTitle: 'Advogado' },
    publisher: {
      '@type': 'Organization',
      name: 'Igor Soares Advogado',
      logo: { '@type': 'ImageObject', url: `${env.siteUrl}/assets/images/logo/logo-mark.svg` },
    },
    datePublished: (article.publishedAt || article.createdAt).toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: `${env.siteUrl}/artigos/${article.slug}/`,
    inLanguage: 'pt-BR',
  };
}

function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

module.exports = { attorneyJsonLd, faqPageJsonLd, articleJsonLd, breadcrumbJsonLd };
