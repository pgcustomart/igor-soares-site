const cheerio = require('cheerio');
const slugify = require('slugify');

/**
 * Ensures every <h2> in the article body has a stable id (for TOC anchors),
 * assigning one from its text when missing. Returns the (possibly patched)
 * HTML plus the extracted heading list for the table of contents.
 */
function extractHeadings(html) {
  const $ = cheerio.load(html, null, false);
  const headings = [];
  const seen = new Set();

  $('h2').each((_, el) => {
    const $el = $(el);
    let id = $el.attr('id');
    if (!id) {
      id = slugify($el.text(), { lower: true, strict: true, locale: 'pt' });
      let unique = id;
      let n = 1;
      while (seen.has(unique)) {
        unique = `${id}-${n}`;
        n += 1;
      }
      id = unique;
      $el.attr('id', id);
    }
    seen.add(id);
    headings.push({ id, text: $el.text() });
  });

  return { html: $.html(), headings };
}

function estimateReadingTime(html) {
  const $ = cheerio.load(html, null, false);
  const words = $.text().trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

module.exports = { extractHeadings, estimateReadingTime };
