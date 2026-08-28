# Dra. Carolina Castello Branco — site

Página única para a Dra. Carolina Castello Branco, ginecologista e obstetra em
Campo Grande/MS. Substitui o site em WordPress + Elementor que estava no ar.

Estático puro: HTML + CSS + JS, **sem build, sem framework, sem banco**. Para
ver localmente, abra o `index.html` no navegador — não precisa de servidor.

**Prévia no ar:** <https://davigaborim.github.io/dra-carolina-castello-branco/>
— é a versão de aprovação, servida pelo GitHub Pages a partir da branch `main`.
O endereço final continua sendo `dracarolinacastellobranco.com.br`.

**Site inteiro: 326 KB.** Para comparação, só as imagens do site da Clínica
Castello Branco somam 6,6 MB.

---

## Arquivos

```
dra-carolina/
├── index.html          a página inteira (todo o conteúdo está aqui)
├── 404.html            endereço errado — "esta página caiu como uma pétala"
├── .htaccess           HTTPS, cache, cabeçalhos de segurança e o 404
├── robots.txt
├── sitemap.xml
├── favicon.svg         a flor de cinco pétalas, reduzida ao que se lê a 16px
├── css/style.css       design system + todas as seções (15 blocos numerados)
├── js/
│   ├── main.js         cabeçalho, menu, revelação, parallax, acordeão
│   ├── flor.js         A FLOR — a assinatura do site
│   └── seda.js         o tecido em WebGL das duas faixas escuras
└── images/             7 arquivos, 200 KB no total
```

### As imagens

Todas vieram do site antigo e foram reprocessadas: redimensionadas para o
tamanho de exibição e convertidas para **WebP** (as fotos) — de ~500 KB para
200 KB, sem perda visível.

| Arquivo | O que é | Origem |
|---|---|---|
| `retrato-carolina.webp` | retrato no consultório | foto do site antigo |
| `clinica-fachada.webp` | fachada ao entardecer | idem |
| `clinica-lounge.webp` | sala de espera | idem |
| `marca-rosa.png` / `marca-clara.png` | **o monograma sozinho**, em rosa e em pérola | extraído do ícone do site antigo |
| `logo-clara.png` | a logo completa, em pérola | logo original |
| `og.jpg` | miniatura de compartilhamento, 1200×630 | montada aqui |

> [!note] O monograma foi recuperado, não redesenhado
> No site antigo o monograma (a silhueta feminina em linha) só existia como
> JPEG creme sobre fundo verde-sage, colado no fundo. Ele foi separado por
> limiar de luminância, virou PNG transparente e agora pode ser pintado de
> qualquer cor. É por isso que ele aparece rosa no cabeçalho e pérola na
> abertura, sendo o mesmo arquivo de origem.

> [!warning] A logo original só existe em branco
> `logo-clara.png` só funciona sobre fundo escuro. Por isso o cabeçalho usa o
> monograma + o nome em tipografia, e não a logo. Se a designer dela mandar
> uma versão em tinta escura, dá para usar a logo no cabeçalho claro também.

---

## Antes de publicar

### 1. CRM e RQE — obrigatório

O rodapé está com `CRM/MS 0000` e `RQE 0000`. **Isso precisa ser preenchido
com os números reais antes de o site ir ao ar.**

A Resolução CFM nº 1.974/2011 (com as alterações da 2.336/2023) exige, em toda
publicidade médica, o **nome do médico e o número de inscrição no CRM**; e o
**RQE** é exigido para anunciar a especialidade — que é exatamente o que o site
faz em cada seção. O site antigo não trazia nenhum dos dois.

Trocar em **dois lugares**, os dois no `index.html`:

- o parágrafo `.rodape__crm`, no rodapé;
- o bloco `application/ld+json`, no fim do arquivo (opcional, mas vale).

### 2. Texto novo que precisa do aval dela

O bloco **"Coleta de preventivo"** é texto novo, escrito por nós. No site
antigo aquela aba estava com o **texto do pré-natal duplicado** — provavelmente
um copiar-e-colar que ficou. O texto que está aqui é orientação geral
(preparo, o que acontece, o que esperar depois), sem conduta, e termina
dizendo que a conduta é individual.

**Peça para a Dra. Carolina ler e ajustar antes de publicar.**

Vale conferir com ela também os itens de **Ginecologia** e **Obstetrícia** na
seção Especialidades: o site antigo só trazia os dois nomes, sem lista, então
o conteúdo foi escrito a partir do que ela já descreve nas orientações.

### 3. Conferir o endereço

O site antigo dizia **"Orla Morena"** no texto e **"Cabreúva"** no mapa. O CEP
(79008-520) e o repositório da Clínica Castello Branco batem com **Cabreúva** —
foi o que ficou. Se ela preferir "Orla Morena", é trocar em um lugar.

---

## Onde trocar cada coisa

| O quê | Onde | Quantas vezes |
|---|---|---|
| WhatsApp `5567984673592` | `index.html` (8) e `404.html` (1) | **9** |
| Telefone exibido `(67) 98467-3592` | `index.html` | 2 |
| Instagram `carolina.castellobranco` | `index.html` | 4 |
| `CRM/MS 0000` e `RQE 0000` | `index.html` | 2 |
| Endereço | `index.html` (texto, mapa, JSON-LD) | 6 |
| Horários | `index.html` (seção Consulta, Contato, JSON-LD) | 4 |
| Domínio | `index.html` (5), `sitemap.xml`, `robots.txt` | 7 |

Os textos das cinco fases são os `<li class="fase">` do `index.html`, em texto
puro. Trocar um texto ali é só editar — a flor não precisa saber de nada.

> [!tip] Se o número mudar
> São 9 lugares e todos são o mesmo literal. `sed -i 's/5567984673592/NOVO/g'
> index.html 404.html` resolve, mas confira depois se o texto exibido
> `(67) 98467-3592` também mudou — esse é escrito por extenso.

---

## As ideias do site

### A flor — `js/flor.js`

É a assinatura. Cinco pétalas, **cinco fases da vida da mulher**: adolescência,
vida reprodutiva, gestação, pós-parto e climatério. A flor abre conforme a
página rola, e a pétala da fase que está sendo lida ganha um contorno de ouro e
cresce um pouco.

Tudo é caminho SVG montado no próprio script — **nenhuma imagem para baixar**.
Três anéis de pétalas, com nervura, um miolo de estames em ouro que só aparece
quando a flor já está quase aberta, e um aro tracejado em prata que gira devagar.

Detalhes que importam se for mexer:

- **Toda pétala fica sempre no seu ângulo final.** O que abre é o tamanho — e a
  largura abre depois do comprimento, então fechada a flor é uma estrela de
  cinco espinhos e aberta é uma flor cheia. A primeira versão girava cada pétala
  no seu próprio tempo, e o meio da animação virava um cata-vento torto.
  **Simetria em todo quadro vale mais que realismo do movimento.**
- **O conteúdo não mora no script.** Os cinco textos são `<li>` no HTML; o
  `flor.js` só mostra um por vez. Sem JS, a classe `.js-flor` não entra no
  `<html>`, a cena volta a ter altura automática e as cinco fases voltam a ser
  uma lista comum — legível e completa.
- **A trilha de cinco segmentos embaixo do texto navega.** Cada segmento é um
  `<button>` com rótulo para leitor de tela; clicar rola até a fase. O enfeite
  também é o índice.
- Com `prefers-reduced-motion: reduce`, a flor nasce aberta, o painel deixa de
  ser preso e as cinco fases viram uma lista. **Sem laço de animação nenhum.**

### A seda — `js/seda.js`

As duas faixas escuras (abertura e contato) têm um tecido correndo por trás do
texto. É WebGL1 puro, sem biblioteca, com *domain warping* — o campo de ruído é
distorcido por ele mesmo duas vezes, e é isso que faz a coisa ler como seda
dobrada em vez de fumaça. O fio de ouro são as cristas finas das dobras.

Liga em qualquer seção com o atributo `data-seda`. Ajustes opcionais:

| Atributo | Padrão | O que faz |
|---|---|---|
| `data-seda-velocidade` | `0.42` | o quão rápido o tecido anda |
| `data-seda-escala` | `1.15` | zoom: maior = dobra mais fina |
| `data-seda-semente` | `41` | muda o desenho sem mudar o resto |
| `data-seda-resolucao` | `0.55` | fração da tela em que ele desenha |

Custo: o canvas é renderizado a **55% do tamanho real** e o `devicePixelRatio`
é limitado a 2 — seda é gradiente macio, ninguém vê a diferença. Um
`IntersectionObserver` desliga quem está fora da tela e a aba escondida derruba
o laço inteiro; todas as seções compartilham **um laço só**.

**Sem WebGL o canvas nem é criado** e fica o gradiente vinho do CSS. Nada quebra.

### O portal e o arco

A abertura **não é hero de duas colunas.** É um arco centralizado — um portal —
com a seda atrás, o monograma na chave e o título em Cormorant, com "em todas as
fases da vida" num degradê de ouro para rosa.

O arco é `border-radius` no próprio bloco (`--arco`, um valor só no `:root`),
sem borda embaixo, então ele escala sozinho em qualquer largura. **O mesmo arco
volta no retrato da seção Sobre** — é o que amarra as duas pontas do site.

No Sobre, o retrato em arco e o cartão de texto **se sobrepõem**: a foto vai da
coluna 1 à 7 e o cartão da 6 à 13, os dois na mesma linha da grade. É a
sobreposição que tira a seção do lugar-comum "foto de um lado, texto do outro".

> [!danger] `grid-row: 1` nos dois é obrigatório
> As colunas 1/7 e 6/13 se sobrepõem na coluna 6. Sem a linha explícita, o
> Grid entende que não cabem juntos e joga o cartão para a linha de baixo —
> a sobreposição some e vira uma pilha. Custou uma rodada de depuração.

### A paleta

Vinho profundo, rosa e ouro; a **prata só aparece como fio** (o aro da flor, os
fios do portal, o fim do degradê da barra de progresso). Metal em área grande
briga com o outro metal; em fio, os dois convivem.

O `--rosa` (#C77E92) e o `--ouro` (#B08D57) são **exatamente os mesmos tokens do
site da Clínica Castello Branco**. Ela atende lá, e os dois sites precisam
parecer da mesma família sem serem o mesmo site. O vinho, a prata e a Cormorant
em corpo grande são o que este tem de próprio.

> [!warning] Nunca use `--ouro` cru em texto pequeno
> O ouro claro não tem contraste sobre fundo claro. Para rótulo existe o
> `--ouro-fundo` (#856637), que é o mais claro que ainda passa 4,5:1 sobre o
> **blush** — o mais escuro dos três papéis (4,79:1). Se clarear esse valor,
> confira o blush primeiro, não o creme.

---

## Medição

**Não há nenhuma ferramenta de medição instalada** — essa é uma decisão da Dra.
Carolina, não nossa. Mas o gancho já está pronto: todo link de WhatsApp tem o
atributo `data-zap`, e o `main.js` dispara um evento no clique **se** houver
Plausible, GA4 ou Umami na página. Sem ferramenta, não faz nada.

Para ligar, basta colar o script da ferramenta no `<head>`. O evento sai
sozinho, com o nome `WhatsApp` (Plausible), `contato_whatsapp` (GA4) ou
`whatsapp` (Umami).

É esse número — quantas pessoas clicaram para falar com ela — que sustenta a
conversa de manutenção. Sem ele, a reunião vira opinião.

---

## Publicar na Hostinger

1. No hPanel: **Gerenciador de arquivos → `public_html`**.
2. Arrastar **o conteúdo** da pasta `dra-carolina/` — os arquivos e as pastas
   `css/`, `js/` e `images/` soltos, **não a pasta inteira**. Se a pasta for
   junto, o site cai em `seudominio.com/dra-carolina/` e os caminhos do
   `404.html`, que começam na raiz, quebram.

> [!danger] O `.htaccess` começa com ponto
> Programa de FTP costuma **esconder** arquivos que começam com ponto. Se ele
> não subir, o site perde HTTPS forçado, cache, cabeçalhos de segurança **e o
> 404 do tubarão** — o visitante vê a tela cinza padrão do servidor. Ligue
> "mostrar arquivos ocultos" antes de enviar.

O site antigo é WordPress. Ao substituir, lembre de **não apagar o banco antes
de confirmar** que ninguém precisa do histórico de posts (o site tinha feed RSS
ativo, então pode haver conteúdo que não aparecia na home).

---

## O que ficou de fora do site antigo, e por quê

| Saiu | Por quê |
|---|---|
| Banner de cookies (CookieYes) | O site novo não tem nenhum rastreador. Sem cookie, não há o que consentir. Se instalar medição, reavalie — Plausible e Umami não usam cookie; GA4 usa. |
| Plugin Joinchat | Substituído pelo botão flutuante próprio, que é 20 linhas de CSS em vez de um plugin. |
| Aba "Coleta de preventivo" com texto do pré-natal | Era duplicação. Reescrita — ver "Antes de publicar". |
| Menu repetido 4× no HTML | Era o Elementor gerando desktop + mobile + variações. Agora é um `<nav>` só. |
| Página de "Sobre a Clínica" separada | Virou a seção "O consultório", já com as fotos. |

---

## Cuidados

- **Publicidade médica.** O texto foi escrito dentro da Resolução CFM nº
  1.974/2011: sem promessa de resultado, sem antes e depois, sem depoimento de
  paciente, sem alegação de superioridade. Ao trocar qualquer texto, mantenha a
  regra — é o que separa este site de um que dá dor de cabeça no Conselho.
- **Nada de `clip-path` para revelar elemento.** Ele zera a área e o
  `IntersectionObserver` passa a enxergar o elemento como fora da tela: a
  animação nunca dispara e a seção fica invisível. Use `opacity`/`transform`,
  como está.
- **`filter` sai depois da entrada.** A classe `.is-limpo` (posta pelo
  `main.js` 300 ms depois) tira o `blur`: `filter` mantém uma camada de
  composição ligada pra sempre e amolece o texto na GPU.
- **Especificidade vence media query.** `.topo .topo__cta{display:none}` no
  celular precisa dos dois seletores: com `.topo__cta` sozinho, o
  `.btn{display:inline-flex}` da seção 3 do CSS vem depois no arquivo e ganha —
  media query **não** conta como especificidade. O botão "Agendar" ficava
  aparecendo espremido ao lado do hambúrguer.
- **O 404 usa caminhos a partir da raiz** (`/css/style.css`) de propósito: ele
  aparece em qualquer endereço errado, inclusive `seudominio.com/uma/pasta/
  funda/`, e caminho relativo quebraria o CSS lá. Isso vale para site publicado
  **na raiz do domínio** — em subpasta, esses caminhos precisam do prefixo.
  Abrir o `404.html` direto do disco mostra a página sem estilo: é esperado.
  No `<head>` dele há um trecho de 8 linhas que reaponta CSS, ícone e script
  **só quando o domínio termina em `.github.io`** — é o que faz o 404 aparecer
  certo na prévia do Pages, onde o site vive em `/<repositório>/`. Em produção
  a condição é falsa e nada disso roda; pode apagar sem quebrar nada.

---

## Verificado

Rodado num Chrome de verdade, sem servidor:

- **Sem estouro horizontal** em 320, 360, 390, 480, 768, 900, 1024, 1280, 1440 e 1920px.
- **Um `<h1>`**, sem salto de nível no sumário de títulos.
- **6 imagens, todas com `width`/`height`** (nada de pulo de layout) e todas com `alt`; 4 com `loading="lazy"`.
- Nenhum link sem texto, botão sem nome ou `<iframe>` sem título.
- **Contraste**: todos os pares de texto passam 4,5:1 — o mais apertado é o
  rótulo dourado sobre o blush, em 4,79:1.
- **Movimento reduzido**: o painel deixa de ser preso (`position: static`), a
  cena volta de 4,5 telas para 1283 px e as cinco fases ficam visíveis juntas.
- **Sem JavaScript**: as cinco fases continuam no documento e legíveis.
- **Sem erro de console** em nenhuma passagem.
