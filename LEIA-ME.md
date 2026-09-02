# Dra. Carolina Castello Branco — site

Página única para a Dra. Carolina Castello Branco, ginecologista e obstetra em
Campo Grande/MS. Substitui o site em WordPress + Elementor que estava no ar.

Estático puro: HTML + CSS + JS, **sem build, sem framework, sem banco**. Para
ver localmente, abra o `index.html` no navegador — não precisa de servidor.

**Prévia no ar:** <https://davigaborim.github.io/dra-carolina-castello-branco/>
— é a versão de aprovação, servida pelo GitHub Pages a partir da branch `main`.
O endereço final continua sendo `dracarolinacastellobranco.com.br`.

**Site inteiro: 561 KB** — 326 KB no lançamento, 371 KB com as fotos novas da
clínica e a marca em vetor, 561 KB depois que os oito cartões de serviço
trouxeram as fotos deles. Para comparação, só as imagens do site da Clínica
Castello Branco somam 6,6 MB, e essas mesmas oito fotos pesam 610 KB em JPG
lá contra 178 KB em WebP aqui.

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
│   └── seda.js         o tecido em WebGL — duas paletas, ver abaixo
├── images/             7 arquivos + servicos/ com 8 fotos, 430 KB no total
└── originais/          o que a cliente mandou; NÃO é servido, é só fonte
```

### As imagens

As fotos são redimensionadas para o tamanho de exibição e convertidas para
**WebP**; a marca e a logo são **vetor**.

| Arquivo | O que é | Origem |
|---|---|---|
| `retrato-carolina.webp` | retrato no consultório | foto do site antigo |
| `clinica-fachada.webp` | fachada com o letreiro, 720×960 | foto nova, 08/2026 |
| `clinica-lounge.webp` | sala de espera, 900×675 | foto nova, 08/2026 |
| `marca.svg` | **a silhueta sozinha**, em `#9E4F66` | vetor de `originais/logo-horizontal.pdf` |
| `logo.svg` | a marca completa com o nome, em `#FBF1F0` | idem |
| `apple-touch-icon.png` | ícone de 180×180 para iOS | gerado do `marca.svg` |
| `og.jpg` | miniatura de compartilhamento, 1200×630 | montada aqui |
| `servicos/*.webp` | as 8 fotos dos cartões de serviço, 800×533 | as mesmas do site da clínica, convertidas |

> [!note] A marca virou vetor em 02/09
> Até então o monograma era um PNG recuperado do site antigo por limiar de
> luminância — e trazia um arco preto solto embaixo, resto do recorte. A
> cliente mandou o PDF da logo, que é **vetor puro** (nenhuma imagem
> embutida): dele saíram `marca.svg` (só a silhueta, recortada por `viewBox`)
> e `logo.svg` (a marca inteira). Foi o que permitiu aumentar a marca na
> abertura sem borrar.

> [!warning] A cor está DENTRO do SVG, não no CSS
> Os dois arquivos são usados em `<img>`, e `<img>` não herda `currentColor` —
> um `fill="currentColor"` renderizaria **preto**. Por isso cada arquivo tem a
> cor fixa: `marca.svg` em rosa (vai sobre papel claro), `logo.svg` em creme
> (vai no rodapé escuro). Para mudar a cor, é um `sed` no próprio arquivo.

### As duas paletas da seda

`js/seda.js` desenha o mesmo tecido em dois climas, escolhidos por
`data-seda-tema` na seção:

| Seção | Tema | Como fica |
|---|---|---|
| `.abertura` | `claro` | rosa de papel; a vinheta **clareia** para o papel e o fio de ouro entra fraco (0.12) |
| `.contato` | `escuro` (padrão) | vinho, como sempre foi |

O véu que protege a leitura acompanha, pela variável `--seda-veu`: escuro por
padrão, claro na abertura.

> [!warning] No claro, o fio de ouro passa a ser textura
> Ele era brilho sobre o vinho. Sobre o papel vira veio de mármore, e a
> abertura ganha uma textura que ninguém pediu. O valor depende do véu: com o
> véu em 84% de branco, `0.18` passava; quando o véu afinou para 66%, o mesmo
> `0.18` voltou a marcar e teve de cair para `0.12`. **Mexeu no véu, reveja o
> fio.**

> [!warning] Amplitude e vinheta são o que faz a dobra existir
> A primeira paleta clara tinha a média certa e as cinco cores muito juntas, com
> a vinheta em `0.34` lavando quase tudo para o papel. Resultado: o tecido
> estava lá, mexendo, e a abertura parecia uma chapada só — foi reprovado
> assim. **O claro pede MAIS distância entre o alto e o fundo da dobra que o
> escuro, não menos:** no vinho meio ponto de luminância já lê. Hoje a paleta
> vai de `#FDF4F3` a `#B26E86` e o piso da vinheta é `0.62`.
>
> E abrir a amplitude move o contraste do texto: a medida que vale deixa de ser
> a cor média e passa a ser **a dobra mais escura que passa por baixo da
> letra** — a seda anda, então uma hora ela passa. Foi o que obrigou o rótulo
> da abertura a escurecer duas vezes. Ver "A paleta".

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
  `<button>` com rótulo para leitor de tela; clicar rola até a fase. Os
  segmentos já vencidos ficam pintados de rosa: é o "2 de 5" sem escrever
  "2 de 5". O enfeite também é o índice.
- **Três coisas dizem ao visitante que é ele quem abre a flor.** Um arco de
  ouro fecha a volta em torno dela conforme a página rola — barra de
  progresso comum, só que redonda e no lugar onde a coisa acontece; o aro
  fino por baixo é o trilho vazio, e tem que ter a mesma espessura do arco,
  senão não lê como "quanto falta". Com a flor ainda fechada aparece a dica
  "role para abrir", com a **mesma cápsula e a mesma setinha da abertura do
  site** — o visitante já fez esse gesto uma vez nesta página, e reconhecer
  é mais rápido que ler. A dica some no primeiro empurrão e volta se ele
  subir de novo.
- **O assentamento é por tempo, não por quadro.** O antigo `tAtual += (tAlvo
  - tAtual) * 0.12` andava um passo por quadro: num navegador que só entrega
  cinco quadros por segundo a flor ficava quatro vezes atrás da rolagem e
  **nunca chegava a abrir de todo** — que é exatamente o "a flor travou" que
  apareceu num navegador de fora. Agora o passo usa o tempo real do quadro e
  ela chega no mesmo lugar em 60Hz, em 120Hz e num navegador engasgado.
- Com `prefers-reduced-motion: reduce`, a flor nasce aberta, o painel deixa de
  ser preso e as cinco fases viram uma lista. **Sem laço de animação nenhum.**
  A dica de rolagem some junto: não há nada para rolar ali.

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
| `data-seda-tema` | `escuro` | `claro` troca a paleta inteira — ver "As duas paletas da seda" |

Custo: o canvas é renderizado a **55% do tamanho real** e o `devicePixelRatio`
é limitado a 2 — seda é gradiente macio, ninguém vê a diferença. Um
`IntersectionObserver` desliga quem está fora da tela e a aba escondida derruba
o laço inteiro; todas as seções compartilham **um laço só**.

**Sem WebGL o canvas nem é criado** e fica o gradiente vinho do CSS. Nada quebra.

**Três defesas contra o tecido travar** (todas nasceram de um navegador de fora
mostrando o fundo parado):

1. **Contexto perdido.** O navegador pode tomar o contexto WebGL de volta a
   qualquer hora — troca de GPU no notebook, driver que reinicia, abas demais
   com WebGL. Quando isso acontece o `drawArrays` vira um nada silencioso e o
   canvas fica **para sempre no último quadro**, sem um erro sequer no console.
   Agora ouvimos `webglcontextlost` (com `preventDefault`, senão o navegador
   nunca restaura) e remontamos tudo no `webglcontextrestored`. Se em 6s não
   voltar, o canvas é removido e fica o gradiente — melhor honesto que
   congelado.
2. **Volta pelo botão "voltar".** Safari e Firefox devolvem a página inteira do
   bfcache e nem sempre disparam `visibilitychange`; o laço tinha sido
   desligado e não religava mais. `pageshow` religa.
3. **Máquina lenta.** O shader faz 15 avaliações de ruído por pixel; sem
   aceleração ele roda a dois quadros por segundo, o que o visitante lê como
   travado. Um vigia conta os quadros lentos e **baixa a resolução**; se ainda
   assim não der, para num quadro parado.

### Os serviços — `#servicos`

Os oito procedimentos vieram da página `/parto` do site da **Clínica Castello
Branco**, onde ela também atende: mesmo texto, mesma ordem, sem reescrita. A
fonte é `src/data/site.ts` daquele repositório, no array `servicosObstetricia`.

A primeira versão era tipográfica, sem foto, para poupar peso. **Foi
descartada:** a cliente aprovou o cartão do site da clínica e pediu igual. O
que está aqui é o `ProcedimentoCard.astro` de lá refeito em CSS puro — mesmo
raio, mesma foto em 3/2, mesmo selo numerado atravessando a quina, mesmo
`<details>` abrindo o botão, mesma pílula rose em degradê.

A tradução foi direta porque os dois sites usam os mesmos valores de cor com
nomes diferentes: `pearl`/`rose`/`rose-deep`/`charcoal`/`lead-soft` de lá são
`--perola`/`--rosa`/`--rosa-fundo`/`--texto-forte`/`--texto-fraco` aqui.

O que **não** é igual, e por quê:

| Lá | Aqui | Motivo |
|---|---|---|
| JPG 1200×800, 610 KB | WebP 800×533, 178 KB | mesma foto, mesmo enquadramento; só o peso |
| `px-8` no botão | `padding-inline:18px` | a coluna daqui é ~26px mais estreita e o texto quebrava em duas linhas |
| grade em `max-w-7xl` | grade no `--wrap` de 1180px | é o container do site inteiro |

**Seção, não subpágina:** é a lista de serviços dela, o conteúdo com mais valor
comercial da página. Numa subpágina, quase ninguém chegaria.

> [!warning] O texto tem dois donos agora
> Se a clínica mudar a descrição de um serviço no `/parto`, este site **não
> muda sozinho** — é cópia, não inclusão. Ao revisar um dos dois, revise o
> outro. O link no fim da seção aponta para lá.

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

> [!warning] A abertura é clara desde 02/09
> A doutora achou o herói vinho "muito forte e escuro". A **forma** ficou igual
> — arco, dois fios, seda atrás, marca no topo — e só o peso saiu: o fundo
> virou rosa de papel e quem carrega o contraste agora é a tinta. Passou por
> dois ajustes no mesmo dia: primeiro claro demais, depois assentou em
> `#F7E6E7` → `#E3BFC7`, com o véu da seda em 30%/52%/66%.
>
> Isso arrastou o cabeçalho junto: o `.topo` **nasce com tinta escura**, e o
> `is-preso` só acrescenta o fundo e a sombra. Não existe mais o estado "sobre
> a faixa escura". Se algum dia a abertura voltar a ser escura, é preciso
> devolver as regras de texto em pérola que foram removidas de `.marca__nome`,
> `.nav a` e `.hamburguer span`.
>
> O rosa mais claro não aguenta texto em pérola: pérola sobre `#B98494` dá
> ~3,0:1, abaixo dos 4,5:1. Ou o fundo é escuro com tinta clara, ou claro com
> tinta escura — o meio-termo é justamente o que não fecha.

O **contato continua escuro**, e é de propósito: a página abre clara, atravessa
os papéis creme e blush e fecha no vinho, com o rodapé junto. A faixa escura no
fim é o contraponto que faz o botão do WhatsApp saltar.

O `--rosa` (#C77E92) e o `--ouro` (#B08D57) são **exatamente os mesmos tokens do
site da Clínica Castello Branco**. Ela atende lá, e os dois sites precisam
parecer da mesma família sem serem o mesmo site. O vinho, a prata e a Cormorant
em corpo grande são o que este tem de próprio.

> [!warning] Nunca use `--ouro` cru em texto pequeno
> O ouro claro não tem contraste sobre fundo claro. Para rótulo existe o
> `--ouro-fundo` (#856637), que é o mais claro que ainda passa 4,5:1 sobre o
> **blush** — o mais escuro dos três papéis (4,79:1). Se clarear esse valor,
> confira o blush primeiro, não o creme.
>
> **A abertura tem um ouro só dela** (`#7A5C31`, em `.abertura .rotulo`): o
> papel do herói ficou mais escuro que o blush, e ali o `--ouro-fundo` cai para
> 4,03:1 — reprova. O valor novo dá 4,68:1, medido no pixel do herói renderizado
> e não na paleta de origem, porque quem pinta o fundo é o canvas da seda, não
> o gradiente do CSS.

> [!note] O gradiente CSS da abertura é só reserva
> O canvas da seda é **opaco** (`alpha:false`) e cobre a seção inteira, com o
> véu por cima. O `background` do `.abertura` só aparece em máquina sem WebGL —
> mas precisa continuar parecido com a seda, senão o site tem duas caras.
> Mexeu em um, mexa no outro.

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
3. **`originais/` não vai.** É a pasta de fonte — os PDFs da logo e as fotos
   como vieram da cliente, meio mega que ninguém baixa. Fica no repositório
   para a marca não se perder de novo, mas não no servidor.

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
- **Nunca `overflow-x: hidden` no `body`, nem `overflow: clip` nos dois eixos
  em quem envolve o palco da flor.** Overflow diferente de `visible` num eixo
  faz o outro virar `auto`, e a caixa vira porta de rolagem — que é a causa
  nº 1 de `position: sticky` que funciona no Chrome e falha no vizinho. O
  palco da flor **depende** de sticky. Use `overflow-x: clip`, que corta sem
  virar porta de rolagem, com `overflow-x: hidden` na linha de cima como
  reserva para quem não conhece `clip`.
- **Unidade nova sempre com reserva na linha de cima.** `min-height: 100svh`
  sozinho não é "cai para 100vh": navegador que não conhece `svh` **joga a
  regra inteira fora**, e a abertura desabava para a altura do texto. Escreva
  `100vh` e, na linha seguinte, `100svh`.
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

E, depois do relato de fundo e flor travados num navegador de fora, rodado nos
**três motores** (Chromium, Gecko/Firefox e WebKit/Safari), com o mesmo
resultado nos três:

- A seda anima; **perde o contexto WebGL e volta a animar sozinha**; e, se o
  contexto não volta, o canvas sai e fica o gradiente (0 canvas restantes).
- O palco continua `sticky` nos três, e a flor **fecha a volta do arco e abre
  por completo** no fim da pista (deslocamento do traço em 0).
- A dica "role para abrir" aparece com a flor fechada e some no empurrão.
- **Sem estouro horizontal** com `overflow-x: clip`, em 1440 e 390px.
- Sem erro de console em nenhum dos três.
