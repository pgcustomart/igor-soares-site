# Igor Soares Advogado — Site Institucional

Site institucional one-page para Igor Soares, advogado trabalhista. Produto de portfólio, tratado como projeto profissional premium.

**Domínio:** igorsoares.adv.br
**Status:** Fase 1 concluída (estrutura visual completa da Home). Aguardando dados reais do cliente e refinamentos. Ver `docs/01-status-projeto.md` para o checkpoint detalhado.

## Stack

HTML5, CSS3 e JavaScript puro — sem frameworks (sem Bootstrap, Tailwind ou jQuery) e sem build tooling. Fontes via Google Fonts: Cormorant Garamond (títulos) + Inter (corpo/UI).

## Como visualizar localmente

Não há build step. Como o site usa `fetch`/JS de módulos carregados por `<script src>`, o ideal é servir por HTTP (abrir `index.html` direto por `file://` funciona, mas alguns navegadores/extensões bloqueiam certos recursos nesse modo). Qualquer servidor estático resolve, por exemplo:

```bash
npx http-server -p 8080 -c-1 .
# depois abra http://localhost:8080/index.html
```

## Documentação do projeto

- `docs/00-arquitetura-e-estrategia.md` — briefing completo: diagnóstico de mercado, análise da referência, conceito visual/marca, wireframes, estratégia de SEO e conversão, roadmap de fases. **Leia antes de tomar decisões de estrutura ou copy.**
- `docs/01-status-projeto.md` — checkpoint do que foi feito, o que é placeholder, e pendências para retomar o trabalho.
- `CLAUDE.md` — guia técnico para trabalhar no código (convenções, estrutura de pastas, decisões de arquitetura).

## Estrutura do projeto

```
index.html
css/base/        (reset, design tokens, tipografia)
css/components/  (header, button, card, faq-accordion, whatsapp-float, footer)
css/sections/    (um arquivo por seção da Home)
css/main.css     (shell de apresentação + utilitários globais)
js/components/   (header-scroll, faq-accordion, reveal-on-scroll, whatsapp-links, smooth-scroll)
js/main.js
assets/          (images, fonts, favicon)
docs/            (documentação estratégica e de status)
sitemap.xml, robots.txt, site.webmanifest
```

## Particularidade de layout: canvas de apresentação

Acima de 1024px de largura, o site é renderizado dentro de um "artboard" branco centralizado (max-width 1600px) sobre um fundo cinza (#e9e9e9), simulando uma mesa de design (Figma/Adobe XD) para facilitar revisão visual. Abaixo de 1024px, o site ocupa a tela inteira normalmente. Ver `.site-canvas` em `css/main.css`.

## Dados pendentes antes do lançamento

Telefone/WhatsApp, e-mail, número da OAB, complemento do endereço, fotografia profissional, depoimentos e tagline ainda são placeholders. Lista completa em `docs/01-status-projeto.md`.
