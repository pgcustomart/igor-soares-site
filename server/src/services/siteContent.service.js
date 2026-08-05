const prisma = require('../db/prisma');

// All of these are singleton rows (id fixed at 1) — simple key/value style
// content blocks edited from the admin panel.

function singletonModel(model) {
  return {
    async get() {
      const row = await prisma[model].findUnique({ where: { id: 1 } });
      if (row) return row;
      return prisma[model].create({ data: { id: 1 } });
    },
    async update(data) {
      return prisma[model].upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });
    },
  };
}

module.exports = {
  siteSettings: singletonModel('siteSettings'),
  homeHero: singletonModel('homeHero'),
  articlesHero: singletonModel('articlesHero'),
  seoSettings: singletonModel('seoSettings'),
};
