const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;
let sessionCookie;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('home page renders 200 with expected title', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Igor Soares/);
  assert.match(html, /site-canvas/);
});

test('articles hub renders 200', async () => {
  const res = await fetch(`${baseUrl}/artigos/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Biblioteca Jurídica|artigos-hub__grid/);
});

test('a known published article renders 200 with JSON-LD', async () => {
  const res = await fetch(`${baseUrl}/artigos/horas-extras/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"FAQPage"/);
});

test('unknown article slug returns 404', async () => {
  const res = await fetch(`${baseUrl}/artigos/nao-existe-123/`);
  assert.equal(res.status, 404);
});

test('sitemap.xml lists published articles', async () => {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(res.status, 200);
  const xml = await res.text();
  assert.match(xml, /<urlset/);
  assert.match(xml, /horas-extras/);
});

test('static assets are served', async () => {
  const res = await fetch(`${baseUrl}/css/main.css`);
  assert.equal(res.status, 200);
});

test('protected API rejects unauthenticated requests', async () => {
  const res = await fetch(`${baseUrl}/api/articles`);
  assert.equal(res.status, 401);
});

test('login rejects wrong password', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SEED_ADMIN_EMAIL, password: 'definitely-wrong' }),
  });
  assert.equal(res.status, 401);
});

test('login succeeds with seeded admin and sets session cookie', async () => {
  const password = process.env.SMOKE_TEST_ADMIN_PASSWORD;
  if (!password) {
    // Password is only known at seed time; skip if not provided to this run.
    return;
  }
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SEED_ADMIN_EMAIL, password }),
  });
  assert.equal(res.status, 200);
  sessionCookie = res.headers.get('set-cookie')?.split(';')[0];
  assert.ok(sessionCookie);
});

test('authenticated article CRUD lifecycle works end to end', async () => {
  if (!sessionCookie) return; // depends on previous login test having a password

  const createRes = await fetch(`${baseUrl}/api/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({
      title: 'Artigo de teste automatizado',
      category: 'Teste',
      excerpt: 'Resumo de teste',
      bodyHtml: '<h2>Teste</h2><p>Conteúdo.</p>',
      readingTimeMin: 2,
    }),
  });
  assert.equal(createRes.status, 201);
  const { article } = await createRes.json();

  const publicBeforePublish = await fetch(`${baseUrl}/artigos/${article.slug}/`);
  assert.equal(publicBeforePublish.status, 404);

  const publishRes = await fetch(`${baseUrl}/api/articles/${article.id}/publish`, {
    method: 'POST',
    headers: { Cookie: sessionCookie },
  });
  assert.equal(publishRes.status, 200);

  const publicAfterPublish = await fetch(`${baseUrl}/artigos/${article.slug}/`);
  assert.equal(publicAfterPublish.status, 200);

  const deleteRes = await fetch(`${baseUrl}/api/articles/${article.id}`, {
    method: 'DELETE',
    headers: { Cookie: sessionCookie },
  });
  assert.equal(deleteRes.status, 200);
});
