# Igor Soares Advogado — Site Institucional + Painel Administrativo

Site institucional one-page para Igor Soares, advogado trabalhista, com painel administrativo próprio (sem CMS/WordPress). Produto de portfólio, tratado como projeto profissional premium.

**Domínio:** igorsoares.adv.br
**Status:** Fase 1 (visual) e Fase 2 (banco de dados + painel administrativo) concluídas. Ver `docs/01-status-projeto.md` (histórico) e `docs/03-painel-administrativo.md` (arquitetura do painel) para o checkpoint detalhado.

## Stack

- **Site público (camada visual):** HTML5, CSS3 e JavaScript puro — sem frameworks front-end. Fontes via Google Fonts: Cormorant Garamond (títulos) + Inter (corpo/UI).
- **Servidor + painel administrativo:** Node.js/Express + PostgreSQL (Railway) via Prisma, páginas públicas renderizadas no servidor (EJS) a partir do banco, e um painel em React + Vite servido em `/admin`. Detalhes completos em `docs/03-painel-administrativo.md`.

## Como rodar localmente

```bash
# Servidor (API + site público + host do painel admin)
cd server
cp .env.example .env      # preencher DATABASE_URL, JWT_SECRET etc.
npm install
npx prisma migrate deploy
npm run dev                # http://localhost:8080

# Painel administrativo (dev com hot reload, opcional)
cd admin-app
npm install
npm run dev                 # http://localhost:5173 (proxy para a API em :8080)
```

Build de produção (raiz do repositório): `npm run build` (builda o admin e prepara o server) seguido de `npm start` (roda as migrations pendentes e sobe o servidor). Ver `railway.json`.

## Documentação do projeto

- `docs/00-arquitetura-e-estrategia.md` — briefing completo: diagnóstico de mercado, análise da referência, conceito visual/marca, wireframes, estratégia de SEO e conversão, roadmap de fases. **Leia antes de tomar decisões de estrutura ou copy.**
- `docs/01-status-projeto.md` — checkpoint histórico da Fase 1 (visual).
- `docs/03-painel-administrativo.md` — arquitetura do banco de dados e do painel administrativo (Fase 2). **Leia antes de mexer em `server/` ou `admin-app/`.**
- `CLAUDE.md` — guia técnico para trabalhar no código (convenções, estrutura de pastas, decisões de arquitetura).

## Estrutura do projeto

```
css/, js/, assets/        (design system e componentes vanilla — inalterados desde a Fase 1)
server/                    (Express: API, SSR das páginas públicas, host do painel admin, Prisma)
admin-app/                 (React + Vite: código-fonte do painel administrativo)
docs/                      (documentação estratégica e de status)
robots.txt, site.webmanifest
```

## Particularidade de layout: canvas de apresentação

Acima de 1024px de largura, o site é renderizado dentro de um "artboard" branco centralizado (max-width 1600px) sobre um fundo cinza (#e9e9e9), simulando uma mesa de design (Figma/Adobe XD) para facilitar revisão visual. Abaixo de 1024px, o site ocupa a tela inteira normalmente. Ver `.site-canvas` em `css/main.css`.

## Dados pendentes antes do lançamento

Número da OAB confirmado e alguns dados de contato ainda são placeholders — mas agora são editáveis diretamente pelo cliente em `/admin` → Configurações, sem precisar de deploy de código.
