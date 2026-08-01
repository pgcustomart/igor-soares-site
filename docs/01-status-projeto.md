# Status do Projeto — Checkpoint 2026-07-31

> Ponto de retomada. Leia este arquivo inteiro antes de continuar o desenvolvimento.

---

## O que foi desenvolvido hoje

1. **Arquitetura e estratégia aprovadas** — `docs/00-arquitetura-e-estrategia.md` (diagnóstico de mercado, análise da referência, conceito visual/marca, wireframes, SEO, conversão, roadmap).
2. **Design system implementado** em `css/base/` — tokens de cor, tipografia, espaçamento e elevação (`variables.css`), reset moderno (`reset.css`), estilos tipográficos base (`typography.css`).
3. **Canvas de apresentação** (`css/main.css`) — fundo cinza (#e9e9e9) com artboard branco centralizado, max-width 1600px, sombra suave, ativo acima de 1024px; abaixo disso o site vira full-width normal.
4. **Home completa em `index.html`**, com as 11 seções: Header, Hero, Sobre, Diferenciais, Áreas de Atuação, Como Funciona, FAQ, Artigos, Contato, Mapa, Footer — mais botão flutuante de WhatsApp.
5. **Seção de Mapa premium** — mapa incorporado (Google Maps, sem API key) em preto-e-branco com card sobreposto (endereço, horário, botões), não um iframe isolado.
6. **Componentes JS** (`js/components/`) — header inteligente (esconde/mostra ao rolar), accordion do FAQ, fade-in ao rolar (IntersectionObserver), montagem de links do WhatsApp com mensagem contextual por botão, menu mobile.
7. **SEO técnico básico** — meta tags, Open Graph, Twitter Card, JSON-LD (`Attorney` + `FAQPage`), `sitemap.xml`, `robots.txt`, `site.webmanifest`, favicon SVG.
8. **QA em navegador real** (servidor local via `http-server`) — validei visualmente Header, Hero, Sobre, Diferenciais, Áreas de Atuação, Como Funciona e o accordion do FAQ (testei o clique, abre/fecha corretamente).
9. **Bug real encontrado e corrigido durante o QA**: o fade-in ao rolar deixava o conteúdo com `opacity:0` por padrão no CSS, dependendo 100% do JS para aparecer — se o script falhasse, o hero ficaria invisível para sempre. Corrigido com padrão `no-js`/`js` (conteúdo nasce visível, só anima quando o JS confirma capacidade de observar a rolagem) + timeout de segurança de 2,5s.

## O que está funcionando (validado visualmente)

- Canvas/artboard de apresentação (efeito Figma/XD).
- Header: transparente no topo, ganha fundo sólido com blur ao rolar, esconde ao descer e reaparece ao subir.
- Hero, Sobre, Diferenciais (4 cards), Áreas de Atuação (6 cards), Como Funciona (timeline 01–04).
- Accordion do FAQ (interação testada por clique real).
- Botão flutuante do WhatsApp posicionado corretamente na borda do canvas (não da janela).

## O que **não** foi validado visualmente ainda

A extensão do Chrome usada para o QA caiu no meio da varredura. Não cheguei a screenshotar:
- Seção Artigos (grid de 3 cards "Em breve")
- Seção Contato
- Seção Mapa (composição do card sobreposto ao iframe)
- Footer
- Responsivo mobile (menu hambúrguer, canvas desativado abaixo de 1024px)

Essas seções reutilizam os mesmos componentes já validados (`card-grid`, `container`, `btn`, `.section`), então o risco de quebra visual é baixo, mas **ainda precisam de conferência visual antes de considerar a Fase 1 100% fechada**.

Auditoria estática feita hoje (sem navegador) confirmou integridade estrutural: todos os `<script>`/`<link>` referenciados existem em disco, todas as tags HTML têm abertura/fechamento balanceados, todos os anchors do menu (`#sobre`, `#diferenciais` etc.) apontam para ids existentes, os dois blocos JSON-LD são JSON válido, e todos os arquivos `.js` passam em `node --check` (sem erro de sintaxe).

## O que ainda utiliza placeholders

| Item | Onde | Valor atual |
|---|---|---|
| Fotografia do Igor | Hero, Sobre, cards de Artigos | `.media-frame` com monograma "IS" (gradiente + traço dourado) |
| Número de WhatsApp | `data-whatsapp` no `<body>` de `index.html` | `5521900000000` |
| Telefone | Seção Contato, Footer | `(21) 00000-0000` |
| E-mail | Seção Contato, Footer | `contato@igorsoares.adv.br` (formato definido, não confirmado como real) |
| OAB | Footer | `OAB/RJ nº 000.000 — a confirmar` |
| Complemento do endereço | Seção Mapa | Só "Estrada dos Bandeirantes, 7000" — sem sala/bloco |
| Horário de atendimento | Seção Mapa | "Segunda a sexta, 9h às 18h" (sugestão, não confirmado) |
| Imagem de compartilhamento (OG) | `<meta property="og:image">` | Aponta para `assets/images/og/cover.jpg`, arquivo **não existe ainda** |
| Depoimentos | — | Seção deliberadamente omitida (nenhum depoimento real disponível) |
| Tagline da marca | — | Ainda não escolhida entre as opções sugeridas em `docs/00-arquitetura-e-estrategia.md` §5 |
| Artigos (conteúdo completo) | Seção Artigos | Só título + resumo de 3 pautas; sem texto completo nem páginas próprias (site é one-page) |

Todos esses pontos estão marcados com `<!-- TODO: ... -->` no código-fonte ou são visualmente óbvios como placeholder (nunca disfarçados de dado real).

## Lista de pendências (dados reais necessários do cliente)

1. Anos de atuação do Igor em Direito do Trabalho (ou decisão consciente de omitir).
2. Número da OAB.
3. Telefone e e-mail oficiais.
4. Complemento do endereço (sala/andar) em Estrada dos Bandeirantes, 7000.
5. Fotografia profissional (editorial) do Igor.
6. Depoimentos reais de clientes, com autorização.
7. Aprovação da tagline.
8. Confirmação/ajuste dos temas dos 3 primeiros artigos.
9. Redes sociais, se houver.
10. Horário de atendimento real.

## Próximos passos recomendados

1. **Concluir o QA visual** das seções ainda não conferidas (Artigos, Contato, Mapa, Footer) e do responsivo mobile.
2. **Coletar os dados reais** da lista de pendências acima — idealmente antes de qualquer novo refinamento visual, para não retrabalhar copy duas vezes.
3. Gerar a imagem de Open Graph (`assets/images/og/cover.jpg`, 1200×630) assim que houver fotografia real.
4. Só depois disso: revisão fina de responsividade (breakpoints intermediários), acessibilidade (navegação por teclado, contraste, leitor de tela) e performance (Lighthouse), conforme fases 8–9 do roadmap em `docs/00-arquitetura-e-estrategia.md`.

## Observações importantes para retomar exatamente deste ponto

- **Não há repositório git inicializado.** Se for continuar com controle de versão, iniciar o repo é o primeiro passo antes de novas mudanças.
- **Não há build step.** Para visualizar o site, servir por HTTP local (`npx http-server -p 8080 -c-1 .`) — abrir `index.html` direto via `file://` é bloqueado pela extensão do Chrome usada para QA (mas deve funcionar normalmente em um navegador comum).
- Nenhum processo de servidor foi deixado rodando ao final desta sessão (o `http-server` iniciado para QA foi encerrado).
- O layout e o design **não foram alterados** nesta sessão de encerramento — apenas documentação e auditoria, conforme solicitado.
- Antes de escrever qualquer copy definitiva (não-placeholder), reler `docs/00-arquitetura-e-estrategia.md` — em especial as diretrizes de tom de voz (sem promessa de resultado, sem alarmismo) e a lista de pendências de dados reais deste documento.
