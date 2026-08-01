# Igor Soares Advogado — Arquitetura e Estratégia do Produto

> Documento de aprovação. Nenhuma linha de HTML/CSS/JS será escrita até este documento ser validado.
> Domínio: igorsoares.adv.br

---

## 1. Diagnóstico do mercado

O mercado de sites para advocacia trabalhista no Brasil é, hoje, dominado por dois padrões ruins:

1. **Fábricas de leads genéricas** — templates WordPress (Divi/Astra), estoque de imagem com balança/martelo/colunas gregas, formulários longos, linguagem alarmista ("descubra agora seus direitos!", "não perca o prazo!"). Competem por volume e tráfego pago, não por relacionamento.
2. **Sites institucionais engessados** — visual "corporativo genérico", textos em juridiquês, zero foco em conversão, feitos para parecer sérios mas que não geram contato nenhum.

Nenhum dos dois padrões serve ao Igor. O diferencial dele é justamente o oposto do atendimento em massa: **relação próxima, acompanhamento pessoal, comunicação direta**. Isso muda a estratégia do site em três pontos:

- O site não deve tentar "capturar lead" com formulário e prometer retorno em 24h — deve **remover fricção até o WhatsApp**, porque é lá que o relacionamento pessoal começa de fato.
- A cópia (texto) não deve ser alarmista nem prometer resultado ("garantimos", "certeza de vitória") — o público de Direito do Trabalho já está em um momento vulnerável (demissão, injustiça); o tom certo é **sério, calmo e claro**, não urgente-agressivo.
- A prova de autoridade não vem de "somos os maiores", vem de **transparência de processo** — mostrar como o atendimento funciona, quem é o advogado, o que esperar depois do primeiro contato.

---

## 2. Análise do site de referência

Análise da estrutura real de `almeidaecarneiroadvogados.com.br/advogado-trabalhista/` (usada apenas como referência estrutural, conforme solicitado — nenhum conteúdo foi copiado):

**Estrutura identificada:**
Header com CTA WhatsApp → 8 cards de "situações atendidas" (segmentação por dor: "trabalhou sem carteira assinada?", "sofreu assédio moral?", etc.) → seção de urgência (prazo de 2 anos para ação trabalhista) → métricas de credibilidade → sobre o escritório → 3 depoimentos → CTA secundário com bullets de diferencial → CTA final → footer com contato.

**Pontos positivos a preservar (como estratégia, não como cópia):**
- Segmentação por "situação/dor" ajuda o visitante a se reconhecer rapidamente ("isso é o que aconteceu comigo").
- Uso de um prazo legal real (prescrição de 2 anos) como motivador genuíno de ação — é informação verdadeira, não é medo artificial.
- CTA para WhatsApp em múltiplos pontos da rolagem.

**Falhas que vamos evitar (oportunidade direta de superação):**
- **Métricas falsas/zeradas** ("0+ anos", "0% foco") — isso quebra a credibilidade instantaneamente, parece site inacabado. Nunca vamos exibir número que não seja real (ver seção 3).
- **Hierarquia de heading fraca** — só H2 solto, sem H1. Péssimo para SEO e para leitores de tela.
- **Nenhum menu/navegação visível** — o visitante não sabe o que existe na página, não consegue pular para uma seção.
- **Nenhuma seção "Como funciona"** — o visitante clica no CTA sem saber o que vai acontecer depois (isso gera ansiedade e abandono).
- **Nenhum FAQ formal.**
- **Nenhum mapa/endereço/como chegar.**
- **Nenhuma foto do advogado individualmente** — o escritório é anônimo, o que contradiz exatamente o diferencial de "atendimento próximo e pessoal" que buscamos aqui.
- **Repetição vazia de CTA** ("Quero saber mais" repetido sem variação de contexto).
- **Nenhum schema.org/JSON-LD, meta tags ou sinal de SEO técnico** perceptível.

---

## 3. Oportunidades de melhoria (o que nos torna superiores)

| Área | Referência | Nossa proposta |
|---|---|---|
| Credibilidade | Métricas zeradas/falsas | Métricas reais (anos de atuação, se houver) **ou remoção completa** da seção de números — nunca inventar dado |
| Navegação | Nenhuma | Menu fixo com anchor links + header inteligente (esconde ao descer, aparece ao subir) |
| Processo | Ausente | Seção "Como Funciona" com 3–4 passos claros |
| Objeções | Ausente | FAQ com accordion + `FAQPage` JSON-LD (rich snippet no Google) |
| Localização | Ausente | Mapa incorporado + botão "Como chegar" (Google Maps) |
| Autoridade pessoal | Escritório anônimo | Foto editorial do Igor, tom de "fala direto comigo" |
| SEO técnico | Inexistente | HTML semântico completo, meta tags, Open Graph, Schema `Attorney`/`LegalService`, sitemap |
| Performance | Não avaliável (WordPress) | HTML/CSS/JS puro, lazy loading, imagens otimizadas, sem frameworks |
| Conteúdo orgânico | Nenhum blog | Seção "Artigos" preparada para crescer (long-tail SEO) |

---

## 4. Conceito visual

**Referências e o porquê de cada uma:**
- **Apple** → espaço em branco generoso, tipografia grande como elemento de design (não só texto), uma ideia por tela/seção.
- **Porsche** → contraste preto/branco preciso, peso editorial, fotografia como protagonista.
- **Escritórios boutique** → sobriedade, exclusividade, ausência de excesso — comunica "atendimento seleto", não "atendimento de massa".

**Paleta e a função de cada cor:**
- **Branco** (~90–95% da superfície) — respiro, clareza, transparência.
- **Vinho** — cor de destaque para CTAs e acentos. Transmite seriedade e tradição sem a agressividade do vermelho puro. Usada com moderação (botões, links ativos, detalhes).
- **Dourado fosco** — detalhes finos apenas: linhas divisórias, ícones, bordas ativas. Fosco (não brilhante) para evitar o efeito "cafona/template". Regra: nunca preencher áreas grandes com dourado, só traços e acentos.
- **Cinza claro** — fundos alternados entre seções (para criar ritmo visual sem usar bordas), texto secundário.
- **Preto** — tipografia principal, header, contraste máximo.

**Tipografia e a lógica editorial por trás da escolha:**
- **Cormorant Garamond** (serifada) para títulos — remete a tradição e prestígio jurídico clássico, mas sem parecer antiga porque será usada em tamanhos grandes com muito espaço, ao estilo de revista/editorial premium.
- **Inter** (sem serifa) para corpo de texto, UI, botões e navegação — legibilidade máxima em tela, neutralidade moderna. O contraste serifada/sem-serifa é o mesmo recurso usado por revistas e marcas premium para equilibrar "clássico" com "contemporâneo".

**Fotografia:** grande, editorial, baixa saturação, tons compatíveis com a paleta (nunca fotos de banco de imagem óbvias — martelo, balança, aperto de mão genérico).

**Micro-interações:** fade-in suave ao rolar (`IntersectionObserver`), hover sutil de cor/opacidade (nunca translação ou zoom exagerado), sem parallax pesado. Regra geral: **a animação nunca deve ser o motivo de nada acontecer** — ela só reforça uma transição que já faria sentido sem ela.

**Grid e espaçamento:** container max-width entre 1200–1280px, respiro entre seções de 96–160px no desktop, para que o site "respire" como um site premium e não pareça espremido.

---

## 5. Conceito de marca

- **Posicionamento:** "Igor Soares Advogado — Direito do Trabalho", com ênfase em atendimento direto e pessoal, não em tamanho de estrutura.
- **Tom de voz:** direto, sereno, confiante. Frases curtas. Sem juridiquês. Sem promessa de resultado — o compromisso comunicado é de **processo** ("análise cuidadosa do seu caso", "acompanhamento direto, do início ao fim"), nunca de resultado ("garantimos", "certeza de vitória").
- **Logotipo:** wordmark tipográfico em Cormorant Garamond, com possibilidade de monograma "IS". Sem símbolos jurídicos clichês (sem balança, sem martelo). Um filete dourado fosco como assinatura visual recorrente (linha divisória, sublinhado de destaque), usado com moderação.
- **Personalidade da marca:** "advogado que te atende pessoalmente", não "escritório institucional grande". Isso deve aparecer em pequenos detalhes de copy: primeira pessoa quando fizer sentido ("eu acompanho cada caso de perto"), sem exagerar a informalidade.

**Precisamos de você para fechar este ponto:** confirmar se existe uma tagline preferida, ou se aprova uma das opções que proponho:
- "Atendimento direto. Estratégia clara."
- "Direito do trabalho, com acompanhamento pessoal em cada etapa."

---

## 6. Arquitetura completa do site

One page, rolagem contínua, menu fixo com anchor links. Ordem das seções (cada uma é uma `<section>` semântica navegável):

1. **Header/Nav** — fixo, transparente no topo, torna-se sólido (fundo branco + sombra sutil) ao rolar. Esconde ao rolar para baixo, reaparece ao rolar para cima (header inteligente).
2. **Hero**
3. **Sobre** (Igor Soares)
4. **Diferenciais**
5. **Áreas de Atuação**
6. **Como Funciona**
7. **Perguntas Frequentes**
8. **Artigos**
9. **Contato**
10. **Mapa**
11. **Footer**

Mais um elemento transversal: **botão flutuante de WhatsApp**, fixo em toda a rolagem (visível a partir do hero), sempre disponível como saída de conversão.

---

## 7. Wireframe textual de todas as seções

### Header (fixo)
```
[ Logo "Igor Soares Advogado" ]     Sobre  Diferenciais  Atuação  Como Funciona  FAQ  Artigos  Contato     [ Falar no WhatsApp ]
```
- Transparente sobre o hero, ganha fundo branco + leve sombra ao rolar.
- Em mobile: menu hamburger, CTA de WhatsApp sempre visível.

### 1. Hero
```
[ Foto grande editorial — Igor Soares ou ambiente do escritório ]

        H1: Advogado Trabalhista — atendimento direto, do primeiro contato à solução

        Subtítulo: Análise cuidadosa do seu caso e acompanhamento pessoal,
        do primeiro contato até a solução.

        [ Botão primário: Falar no WhatsApp ]   [ Link secundário: Como funciona ↓ ]
```
- Único H1 da página.
- CTA primário sempre vinho, com micro-hover.

### 2. Sobre
```
[ Foto editorial do Igor ]     Sobre Igor Soares

                                Texto curto (3–4 parágrafos): trajetória,
                                especialização em Direito do Trabalho,
                                forma de trabalhar (atendimento próximo,
                                acompanhamento pessoal de cada caso).

                                [ Falar no WhatsApp ]
```

### 3. Diferenciais
```
              Por que trabalhar comigo

[ícone]           [ícone]              [ícone]             [ícone]
Atendimento       Comunicação          Compromisso         Acompanhamento
personalizado     direta e clara       com prazos          próximo em cada
                                                            etapa do processo
```
- Grid de 4 cards, ícones em traço fino (dourado fosco), sem emojis.
- Copy baseada no perfil real informado: determinado, estrategista, pontual, comunicação direta.

### 4. Áreas de Atuação
```
              Áreas de Atuação em Direito do Trabalho

[ Card ]  Rescisão e verbas trabalhistas
[ Card ]  Reconhecimento de vínculo empregatício
[ Card ]  Horas extras não pagas
[ Card ]  Assédio moral no ambiente de trabalho
[ Card ]  Acidente de trabalho e doença ocupacional
[ Card ]  Justa causa e demissão indevida
```
- Cards com hover sutil (elevação leve + borda dourada fosca).
- Cada card pode futuramente linkar a uma página própria de artigo/detalhe (SEO).

### 5. Como Funciona
```
              Como funciona o atendimento

  01 ─────── Contato inicial pelo WhatsApp
  02 ─────── Análise inicial do seu caso
  03 ─────── Reunião por vídeo ou presencial, quando necessário
  04 ─────── Definição da estratégia e acompanhamento direto
```
- Layout em linha do tempo vertical (mobile) / horizontal (desktop), com linha fina dourada conectando os passos.
- Esta seção existe especificamente para reduzir a ansiedade de "o que acontece depois que eu clico" — ponto que a referência não tinha.

### 6. Perguntas Frequentes
```
              Perguntas Frequentes

  [+] Quanto tempo tenho para entrar com uma ação trabalhista?
  [+] Preciso ir até o escritório para o primeiro atendimento?
  [+] Como funciona o valor dos honorários?
  [+] Meu caso tem chance? (resposta honesta: depende de análise, sem prometer resultado)
  [+] Atende casos fora do Rio de Janeiro?
```
- Accordion (um item aberto por vez), marcado com `FAQPage` JSON-LD.
- Perguntas reais precisam ser validadas/fornecidas pelo Igor (ver seção de pendências, ao final).

### 7. Artigos
```
              Artigos

[ Card artigo 1 ]     [ Card artigo 2 ]     [ Card artigo 3 ]
imagem, título,       imagem, título,       imagem, título,
resumo curto          resumo curto          resumo curto

                    [ Ver todos os artigos ]
```
- Fase inicial: 3 artigos estáticos (conteúdo real, não lorem ipsum) sobre dúvidas comuns de Direito do Trabalho.
- Preparado estruturalmente para virar blog completo depois (ver roadmap).

### 8. Contato
```
              Vamos conversar sobre o seu caso

  [ Botão grande: Falar no WhatsApp ]

  Telefone: (xx) xxxxx-xxxx        E-mail: contato@igorsoares.adv.br
```
- CTA único e proeminente — sem formulário longo, conforme estratégia de baixa fricção. Telefone/e-mail como alternativa secundária, não como caminho principal.

### 9. Mapa
```
[ Mapa incorporado (Google Maps embed) ]

  Estrada dos Bandeirantes, 7000 — [complemento a confirmar]

  [ Botão: Como chegar ]  → abre Google Maps com rota
```

### 10. Footer
```
Igor Soares Advogado                 Navegação            Contato
Direito do Trabalho                  Sobre                WhatsApp
                                      Diferenciais         E-mail
OAB/XX nº xxxxx (a confirmar)         Atuação              Telefone
                                      FAQ

© 2026 Igor Soares Advogado — Todos os direitos reservados.
Este site não constitui aconselhamento jurídico.
```

---

## 8. Estratégia de SEO

- **HTML semântico completo**: um único `<h1>` no hero, `<h2>` por seção, `<h3>` para subitens (cards de área de atuação, perguntas do FAQ). `<nav>`, `<main>`, `<footer>`, `<address>` usados corretamente.
- **Meta tags**: `title` único (ex.: "Igor Soares Advogado | Direito do Trabalho"), `description` objetiva (~150–160 caracteres), `canonical`.
- **Open Graph e Twitter Card**: imagem de compartilhamento própria (não a foto do hero cortada de qualquer jeito — uma peça 1200×630 pensada para isso).
- **Schema.org / JSON-LD**: `Attorney` ou `LegalService` (nome, endereço, telefone, área de atuação), `FAQPage` (perguntas do FAQ), `BreadcrumbList` quando existirem páginas internas de artigos.
- **Hierarquia de heading correta** — corrige a maior falha técnica identificada no site de referência.
- **Performance como fator de SEO**: Core Web Vitals — LCP otimizado (imagem do hero pré-carregada e comprimida), CLS zero (dimensões de imagem sempre declaradas), INP baixo (JS mínimo, sem bloqueio de main thread).
- **SEO local**: NAP consistente (Nome/Endereço/Telefone idênticos em todo o site e no Google Business Profile), mapa incorporado, endereço marcado com `<address>` e schema `PostalAddress`.
- **Conteúdo orgânico de cauda longa**: seção Artigos preparada para crescer com termos como "rescisão indireta o que é", "fui demitido sem justa causa quais meus direitos", "assédio moral no trabalho como provar" — cada um como página indexável própria no futuro.
- **Arquivos técnicos**: `sitemap.xml`, `robots.txt`, favicon completo (todos os tamanhos), `site.webmanifest`.
- **Acessibilidade** (também sinal indireto de SEO): contraste AA mínimo, `alt` em todas as imagens, navegação por teclado, `aria-expanded` no accordion do FAQ.

---

## 9. Estratégia de conversão

- **Um único CTA mestre**: "Falar no WhatsApp", repetido em pontos estratégicos (hero, sobre, diferenciais, como funciona, contato) e sempre visível via botão flutuante.
- **Mensagens do WhatsApp contextuais**: o link `wa.me` pode carregar uma mensagem pré-preenchida diferente dependendo de onde o clique aconteceu (ex.: clique em "Assédio moral" pré-preenche "Olá, gostaria de falar sobre uma situação de assédio moral no trabalho"), reduzindo o atrito de "o que eu escrevo agora".
- **Seção "Como Funciona" como redutor de ansiedade** — o visitante sabe exatamente o que esperar antes de clicar, o que aumenta a taxa de conversão comparado a um CTA "cego".
- **FAQ como removedor de objeções** antes da decisão de contato (dúvidas sobre prazo, custo, necessidade de ir ao escritório).
- **Prova social honesta**: apenas dados reais (anos de atuação, se aplicável) — nunca métricas inventadas ou zeradas, que é exatamente o que quebrou a credibilidade no site de referência.
- **Sem popups agressivos ou exit-intent** — incompatível com o posicionamento premium; a conversão vem de confiança construída pela navegação, não de interrupção forçada.
- **Formulário de contato**: deliberadamente omitido como via principal. Telefone e e-mail existem como alternativa secundária no rodapé/seção de contato, mas o caminho preferencial é sempre o WhatsApp — alinhado ao desejo do Igor de proximidade real, não de "triagem por formulário".

---

## 10. Estrutura completa de pastas do projeto

```
igor-soares-advogado/
├── index.html
├── CLAUDE.md
├── README.md
├── docs/
│   └── 00-arquitetura-e-estrategia.md
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── sobre/
│   │   ├── artigos/
│   │   ├── icons/
│   │   └── og/                    (imagem de compartilhamento social)
│   ├── fonts/                     (se hospedadas localmente)
│   └── favicon/
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css          (design tokens: cores, espaçamento, tipografia, breakpoints)
│   │   └── typography.css
│   ├── components/
│   │   ├── header.css
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── faq-accordion.css
│   │   ├── whatsapp-float.css
│   │   └── footer.css
│   ├── sections/
│   │   ├── hero.css
│   │   ├── sobre.css
│   │   ├── diferenciais.css
│   │   ├── areas-atuacao.css
│   │   ├── como-funciona.css
│   │   ├── artigos.css
│   │   ├── contato.css
│   │   └── mapa.css
│   └── main.css                   (agrega os imports acima)
└── js/
    ├── components/
    │   ├── header-scroll.js       (header inteligente: esconde/mostra ao rolar)
    │   ├── faq-accordion.js
    │   ├── smooth-scroll.js       (rolagem suave para anchor links)
    │   ├── reveal-on-scroll.js    (fade-in via IntersectionObserver)
    │   └── whatsapp-links.js      (monta os links wa.me com mensagem contextual)
    └── main.js                    (inicializa os componentes)
```

**Justificativa técnica:** separação por camada (`base` → tokens e reset; `components` → peças reutilizáveis; `sections` → estilo específico de cada seção da página) permite que o projeto cresça (novas páginas de artigo, novas seções) sem reescrever CSS existente. Cada arquivo JS é um módulo independente com responsabilidade única — nenhuma dependência de framework, mas organização equivalente à de um projeto de componentes.

---

## 11. Roadmap de desenvolvimento

| Fase | Entrega |
|---|---|
| **Fase 0** | Este documento — aprovação da arquitetura, marca e conteúdo antes de programar |
| **Fase 1** | Setup do projeto: estrutura de pastas, design tokens (cores/tipografia/espaçamento em `variables.css`), reset CSS, carregamento de fontes |
| **Fase 2** | Header + navegação + Hero (header inteligente, menu fixo, anchor links) |
| **Fase 3** | Seções institucionais: Sobre, Diferenciais, Áreas de Atuação |
| **Fase 4** | Como Funciona + FAQ (accordion acessível + `FAQPage` JSON-LD) |
| **Fase 5** | Artigos (3 posts estáticos) + Contato + Mapa incorporado |
| **Fase 6** | Footer + botão flutuante de WhatsApp + micro-interações (fade-in, hover) em todas as seções |
| **Fase 7** | SEO técnico: meta tags, Open Graph, Schema.org completo, sitemap.xml, robots.txt |
| **Fase 8** | Performance: otimização/compressão de imagens, lazy loading, auditoria Lighthouse (meta: 90+ em todas as categorias) |
| **Fase 9** | Acessibilidade: contraste AA, navegação por teclado, `aria-*`, teste com leitor de tela |
| **Fase 10** | QA cross-browser e responsivo (mobile/tablet/desktop) + preparação para deploy |

---

## Pendências — informações reais necessárias antes de escrever qualquer copy final

Para não repetir o erro do site de referência (métricas zeradas, dados falsos), preciso confirmar com você:

1. **Anos de atuação** do Igor em Direito do Trabalho (se não quiser expor, tudo bem — removemos a seção de números).
2. **Número da OAB** (necessário para o rodapé e também costuma ser exigido no registro do domínio `.adv.br` no Registro.br).
3. **Telefone e e-mail** oficiais de contato.
4. **Complemento do endereço** (sala/andar) em Estrada dos Bandeirantes, 7000, para o embed do mapa funcionar com precisão.
5. **Foto profissional** do Igor (editorial, para hero e seção Sobre) — ou se será feita sessão de fotos.
6. **Depoimentos reais** de clientes (com autorização), se existirem — senão, a seção de depoimentos é omitida em vez de usar placeholders.
7. **Tagline** — aprovar uma das sugeridas na seção 5 ou fornecer outra.
8. **Temas dos 3 primeiros artigos** — posso sugerir pautas, mas prefiro validar com você quais fazem mais sentido para o perfil de cliente dele.
9. **Redes sociais** (se houver, para o footer).

---

**Aguardando sua aprovação (ou ajustes) desta arquitetura antes de iniciarmos a Fase 1.**
