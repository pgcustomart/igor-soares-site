const slugify = require('slugify');
const prisma = require('../db/prisma');

const relatedArticleSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  coverImageAlt: true,
  readingTimeMin: true,
  status: true,
};

const articleInclude = {
  faqs: { orderBy: { order: 'asc' } },
  relatedFrom: { include: { relatedArticle: { select: relatedArticleSelect } }, orderBy: { order: 'asc' } },
};

function toSlug(value) {
  return slugify(value, { lower: true, strict: true, locale: 'pt' });
}

async function listArticles({ search, status } = {}) {
  return prisma.article.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: 'desc' },
  });
}

async function getArticleById(id) {
  return prisma.article.findUnique({ where: { id }, include: articleInclude });
}

async function getArticleBySlug(slug) {
  return prisma.article.findUnique({ where: { slug }, include: articleInclude });
}

async function getPublicArticleBySlug(slug) {
  const article = await prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: articleInclude,
  });
  if (!article) return null;

  let related = article.relatedFrom
    .map((r) => r.relatedArticle)
    .filter((a) => a.status === 'PUBLISHED');

  if (related.length < 3) {
    const fillers = await prisma.article.findMany({
      where: { status: 'PUBLISHED', slug: { not: slug }, id: { notIn: related.map((r) => r.id) } },
      select: relatedArticleSelect,
      orderBy: { publishedAt: 'desc' },
      take: 3 - related.length,
    });
    related = [...related, ...fillers];
  }

  return { ...article, related: related.slice(0, 3) };
}

async function listPublishedArticles({ take } = {}) {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    ...(take ? { take } : {}),
  });
}

async function ensureUniqueSlug(base, ignoreId) {
  let slug = toSlug(base);
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    attempt += 1;
    slug = `${toSlug(base)}-${attempt + 1}`;
  }
}

async function createArticle(data) {
  const slug = await ensureUniqueSlug(data.slug || data.title);
  const { faqs, relatedIds, ...rest } = data;
  const article = await prisma.article.create({
    data: {
      ...rest,
      slug,
      faqs: faqs?.length
        ? { create: faqs.map((f, i) => ({ question: f.question, answer: f.answer, order: i })) }
        : undefined,
    },
    include: articleInclude,
  });
  if (relatedIds?.length) {
    await setRelated(article.id, relatedIds);
  }
  return getArticleById(article.id);
}

async function updateArticle(id, data) {
  const { faqs, relatedIds, ...rest } = data;
  if (rest.slug) {
    rest.slug = await ensureUniqueSlug(rest.slug, id);
  }
  if (rest.status === 'PUBLISHED') {
    const current = await prisma.article.findUnique({ where: { id } });
    if (current && !current.publishedAt) {
      rest.publishedAt = new Date();
    }
  }
  await prisma.article.update({ where: { id }, data: rest });

  if (faqs) {
    await prisma.articleFaq.deleteMany({ where: { articleId: id } });
    if (faqs.length) {
      await prisma.articleFaq.createMany({
        data: faqs.map((f, i) => ({ articleId: id, question: f.question, answer: f.answer, order: i })),
      });
    }
  }

  if (relatedIds) {
    await setRelated(id, relatedIds);
  }

  return getArticleById(id);
}

async function setRelated(articleId, relatedIds) {
  await prisma.articleRelated.deleteMany({ where: { articleId } });
  const ids = relatedIds.filter((rid) => rid !== articleId);
  if (ids.length) {
    await prisma.articleRelated.createMany({
      data: ids.map((relatedArticleId, i) => ({ articleId, relatedArticleId, order: i })),
    });
  }
}

async function deleteArticle(id) {
  await prisma.article.delete({ where: { id } });
}

async function duplicateArticle(id) {
  const original = await getArticleById(id);
  if (!original) return null;
  const slug = await ensureUniqueSlug(`${original.slug}-copia`);
  const copy = await prisma.article.create({
    data: {
      slug,
      title: `${original.title} (cópia)`,
      category: original.category,
      excerpt: original.excerpt,
      coverImage: original.coverImage,
      coverImageAlt: original.coverImageAlt,
      readingTimeMin: original.readingTimeMin,
      bodyHtml: original.bodyHtml,
      status: 'DRAFT',
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      canonicalUrl: '',
      robots: original.robots,
      ogImage: original.ogImage,
      ctaTitle: original.ctaTitle,
      ctaText: original.ctaText,
      faqs: original.faqs.length
        ? { create: original.faqs.map((f) => ({ question: f.question, answer: f.answer, order: f.order })) }
        : undefined,
    },
  });
  return getArticleById(copy.id);
}

async function setStatus(id, status) {
  return updateArticle(id, { status });
}

module.exports = {
  toSlug,
  listArticles,
  listPublishedArticles,
  getArticleById,
  getArticleBySlug,
  getPublicArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  duplicateArticle,
  setStatus,
};
