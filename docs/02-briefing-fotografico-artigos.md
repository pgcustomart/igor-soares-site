# Briefing fotográfico — capas dos artigos (biblioteca jurídica)

Este documento existe porque 7 dos 10 artigos da nova seção `/artigos` foram publicados com um placeholder visual (`.media-frame` com monograma "IS") no lugar da fotografia de capa — não há gerador de imagem disponível neste fluxo de trabalho para produzi-las. Use este briefing para contratar um fotógrafo ou selecionar imagens de banco compatíveis, mantendo a mesma coleção visual das 3 fotos já existentes.

## Padrão visual de referência (as 3 fotos já existentes)

Antes de fotografar qualquer imagem nova, observe `assets/images/artigos/demissao-sem-justa-causa.webp`, `rescisao-indireta.webp` e `assedio-moral.webp`. Todas compartilham:

- **Enquadramento**: plano fechado em mãos, tronco e documentos — rosto sempre cortado ou fora de foco, nunca identificável (privacidade + evita parecer banco de imagens genérico).
- **Cenário**: escritório corporativo neutro, mesa de madeira clara, elementos de trabalho ao fundo desfocados (cadeiras, prateleiras).
- **Iluminação**: luz natural suave, quente, aparentemente vinda de uma janela lateral; sombras suaves, nunca dura ou de estúdio com flash direto.
- **Paleta**: tons neutros e amadeirados (bege, marrom, azul-marinho da roupa), papel branco em destaque, sem cores saturadas ou vibrantes.
- **Profundidade de campo rasa**: fundo desfocado, plano principal (mãos + documento) nítido.
- **Texto legível na cena**: um documento físico com um título curto e direto relacionado ao tema do artigo, digitado em fonte simples tipo formulário (não é o título do artigo, é um "prop" narrativo, ex.: "SEM JUSTA CAUSA" na foto 1).
- **Proporção de entrega**: exportar em pelo menos 1536×1024px (ou maior), formato `.webp`. Essa mesma imagem é usada tanto no card (recortada 16:10 via CSS) quanto no topo do artigo (recortada 16:9 via CSS) — não é preciso entregar dois arquivos.

Sem ilustrações, sem 3D, sem banco de imagens com pessoas sorrindo olhando para a câmera — o objetivo é parecer um flagrante editorial discreto, não uma foto de stock genérica.

## As 7 imagens a produzir

Nome de arquivo sugerido entre parênteses (salvar em `assets/images/artigos/`).

### 4. Horas extras (`horas-extras.webp`)
Mãos sobre o teclado de um computador, com um relógio de mesa ou o relógio do canto da tela do computador visível mostrando um horário tardio (ex.: 21h40). Xícara de café ao lado, luz de escritório já mais escura/artificial ao fundo (contraste com a luz de janela das outras fotos, já que aqui é depois do expediente). Se usar um documento, pode ser uma planilha impressa de ponto/horas com títulos de coluna visíveis.

### 5. Intervalo de almoço (`intervalo-de-almoco.webp`)
Uma marmita ou embalagem de almoço fechada e intocada ao lado do teclado, com as mãos ainda digitando ou segurando o celular respondendo mensagem de trabalho. A ideia é comunicar "o almoço ficou esquecido na mesa". Relógio de pulso ou celular mostrando um horário claramente fora do horário de almoço (ex.: 15h12).

### 6. Demissão durante afastamento médico (`demissao-durante-afastamento-medico.webp`)
Mãos segurando um atestado médico (papel com timbre neutro e o texto "ATESTADO MÉDICO" legível) ao lado de um celular mostrando uma notificação ou mensagem de desligamento (tela do celular desfocada o suficiente para não parecer uma interface real de nenhum app específico). Ambiente pode ser mais doméstico (mesa de casa) em vez de escritório, para diferenciar visualmente do tema "empresa".

### 7. Gestante pode ser demitida (`gestante-pode-ser-demitida.webp`)
Mesma composição da foto 1 (mãos recebendo um documento de rescisão sobre uma mesa de escritório), mas com a barriga de gravidez visivelmente enquadrada na cena, mantendo o rosto fora de quadro. Documento com o texto "TERMO DE RESCISÃO" legível, igual ao padrão da foto 1, para reforçar que é uma variação do mesmo "gênero" de imagem.

### 8. Acidente de trabalho (`acidente-de-trabalho.webp`)
Capacete de segurança e luvas de proteção sobre uma mesa ou bancada, ao lado de um formulário com o texto "COMUNICAÇÃO DE ACIDENTE DE TRABALHO" (CAT) legível. Ambiente pode ser industrial/canteiro de obras desfocado ao fundo, ou uma mesa de escritório de RH preenchendo o formulário — qualquer uma das duas leituras funciona, desde que mantenha a mesma paleta e iluminação de referência.

### 9. FGTS: quando posso sacar (`fgts-quando-posso-sacar.webp`)
Mãos segurando um celular com o aplicativo de um banco/extrato aberto (tela desfocada o suficiente para não reproduzir a marca real da Caixa Econômica Federal), com um extrato impresso ou caderneta ao lado sobre a mesa. Pode incluir uma calculadora física, reforçando a ideia de "conferência de valores".

### 10. Prazo para pagamento da rescisão (`prazo-pagamento-rescisao.webp`)
Um calendário de mesa com um dia específico circulado a caneta, ao lado de um envelope ou documento de pagamento parcialmente visível. Alternativa: mãos segurando um documento de rescisão ao lado de um relógio de mesa, reforçando a ideia de prazo/contagem de dias.

## Checklist antes de publicar cada imagem

- [ ] Rosto não identificável (cortado ou fora de foco)
- [ ] Paleta neutra e quente, compatível com as 3 fotos existentes
- [ ] Luz suave, sem flash direto
- [ ] Texto do documento em cena é legível e coerente com o tema
- [ ] Exportação em `.webp`, mínimo 1536px de largura
- [ ] Arquivo nomeado exatamente como listado acima e salvo em `assets/images/artigos/`

## Como substituir o placeholder depois que a foto existir

Cada página de artigo usa este bloco onde a foto entra:

```html
<div class="media-frame">
  <span class="media-frame__monogram" aria-hidden="true">IS</span>
</div>
```

Substituir por (ajustando `src`, `alt` e o caminho relativo conforme a página — `../../assets/...` nas páginas de artigo, `../assets/...` no hub, `assets/...` na home):

```html
<div class="media-frame">
  <img src="../../assets/images/artigos/horas-extras.webp" alt="Descrição real da cena" width="1536" height="1024" loading="lazy">
</div>
```

O mesmo arquivo é referenciado em até três lugares por artigo: a capa do próprio artigo, o card no hub `/artigos/` e o card nos blocos de "Artigos relacionados" de outras páginas — vale usar busca por nome do arquivo no projeto para não esquecer nenhuma ocorrência.
