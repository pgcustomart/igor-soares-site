# Painel Administrativo — Arquitetura (Fase 2)

> Checkpoint: 2026-08-05. Leia isto antes de mexer em `server/` ou `admin-app/`.

## Por que essa arquitetura

O pedido do cliente foi explícito: um painel administrativo **exclusivo** para este projeto (sem WordPress/CMS pronto), preservando o design atual pixel a pixel, com o conteúdo migrado para PostgreSQL e pensado para ser reaproveitado como base para outros clientes no futuro. Isso levou a três decisões centrais:

1. **Camada visual continua vanilla.** Todo o CSS/JS de `css/` e `js/` é o mesmo da Fase 1 — nada de framework de front-end na parte pública do site. O painel administrativo é a única parte do projeto com build step e framework (React), e fica isolado em `admin-app/`.
2. **Renderização no servidor (SSR), não estática.** As páginas públicas (`/`, `/artigos/`, `/artigos/:slug/`) são geradas a cada request por um servidor Express usando templates EJS que são cópias fiéis do HTML estático original, só que preenchidos com dados do Postgres via Prisma. Isso satisfaz o pedido de "conteúdo carregado dinamicamente do banco" mantendo HTML real (bom para SEO) em vez de um SPA que buscaria conteúdo via JS no cliente.
3. **Escopo do que é editável é deliberadamente menor que "o site inteiro".** Só viraram campos de admin as seções que o cliente pediu explicitamente: artigos, hero da Home, hero de Artigos, configurações do site (telefone/WhatsApp/e-mail/endereço/redes/Maps), SEO (Home e Artigos) e a biblioteca de imagens. Seções como Sobre, Diferenciais, Áreas de Atuação, Como Funciona e o FAQ da Home continuam hardcoded no template — não pedidas, não implementadas, evitando um painel com 40 campos que ninguém pediu.

## Stack

- **Servidor:** Node.js + Express (`server/`), CommonJS.
- **Banco:** PostgreSQL no Railway, acessado via Prisma (schema em `server/prisma/schema.prisma`, migrations versionadas em `server/prisma/migrations/`).
- **Renderização pública:** EJS (`server/src/views/`), servida no mesmo processo Express.
- **Autenticação:** cookie httpOnly com JWT assinado (`server/src/lib/jwt.js`), bcrypt para senha, rate-limit no login. Tabela `User` já tem campo `role` (`ADMIN` | `EDITOR`) pronta para múltiplos usuários — só falta a tela de gestão de usuários (ver "Preparado para o futuro" abaixo).
- **Upload de imagens:** `multer` (memória) + `sharp` (conversão para WEBP, otimização, variantes desktop/mobile para heros) — `server/src/services/images.service.js`.
- **Painel admin:** React + Vite (`admin-app/`), SPA servida em `/admin` pelo próprio Express (build gerado em `server/admin-dist/`, gitignored). Editor de corpo de artigo é o Tiptap (rich text, sem precisar escrever HTML).

## Modelo de dados (resumo)

- `User` — login do painel.
- `Article` + `ArticleFaq` + `ArticleRelated` — artigos completos: slug, categoria, resumo, imagem de capa, tempo de leitura, corpo (HTML), status (`DRAFT`/`PUBLISHED`), SEO próprio, CTA final, FAQ e relacionados.
- `Image` — biblioteca de mídia (arquivo, pasta, variante, dimensões).
- `SiteSettings`, `HomeHero`, `ArticlesHero`, `SeoSettings` — linhas únicas (singleton, id fixo em 1), editadas via upsert.

## Migração do conteúdo estático

`server/scripts/migrate-static-content.js` foi rodado uma vez para importar o conteúdo real do `index.html`, `artigos/index.html` e dos 12 `artigos/<slug>/index.html` originais para o Postgres — título, categoria, resumo, corpo, FAQ, artigos relacionados, datas de publicação/atualização (extraídas do JSON-LD original) e todos os campos de SEO. Nenhum dado foi inventado: placeholders que já existiam (ex. "OAB/RJ nº 000.000 (a confirmar)") continuam placeholders no banco. O script é idempotente (upsert por slug) — pode rodar de novo sem duplicar nada, mas não faz parte do fluxo normal de desenvolvimento.

## Rodando localmente

```bash
# 1. Servidor (API + SSR + admin host)
cd server
cp .env.example .env   # preencher DATABASE_URL (Railway), JWT_SECRET etc.
npm install
npx prisma migrate deploy
npm run dev             # http://localhost:8080

# 2. Painel admin (dev, com hot reload)
cd admin-app
npm install
npm run dev              # http://localhost:5173, proxy /api e /uploads para :8080
```

Para produção, `npm run build` na raiz do repo builda o admin (`admin-app` → `server/admin-dist`) e prepara o server; `npm start` na raiz roda `prisma migrate deploy` e sobe o Express (ver `railway.json`).

## Variáveis de ambiente (server/.env)

Ver `server/.env.example`. Nunca commitar `.env` real — só `.env.example` com placeholders vai para o git.

## Segurança / limites do painel

- O cliente só edita conteúdo (ver seção "Por que essa arquitetura" acima). Não existe campo de HTML/CSS/JS livre em nenhuma tela do admin — isso é proposital, não uma limitação a "corrigir depois".
- Rotas `/api/*` (exceto `/api/auth/login`) exigem cookie de sessão válido; artigos em rascunho (`DRAFT`) nunca aparecem nas rotas públicas nem no sitemap.
- Uploads aceitam apenas `image/jpeg|png|webp|gif`, limite de 15MB, sempre reprocessados via `sharp` (nunca servimos o arquivo enviado sem reprocessar).

## Preparado para o futuro (não implementado agora, só o schema/estrutura permite)

- **Múltiplos usuários/papéis:** `User.role` já existe; falta só a tela de CRUD de usuários no admin.
- **Analytics de artigos (views, cliques no WhatsApp):** nenhuma tabela de eventos ainda — adicionar quando houver necessidade real, não antes.
- **Agendamento de publicação:** `Article.status`/`publishedAt` já modelam publicado/rascunho; um campo `scheduledAt` + um job de publicação automática é a extensão natural quando for pedido.
- **Geração de artigos com IA:** fora de escopo desta fase; o editor Tiptap já produz o mesmo formato de HTML que qualquer pipeline de geração precisaria produzir.
- **Backup automático:** o Postgres do Railway já tem backups gerenciados pela plataforma; nada adicional foi configurado neste momento.
