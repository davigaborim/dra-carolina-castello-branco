/* ==========================================================================
   A FLOR — a assinatura do site

   Cinco pétalas, cinco fases da vida da mulher. A flor abre uma pétala por
   fase conforme a página rola, e a pétala que acaba de abrir é a fase que
   está sendo lida. O enfeite é o índice: clicar num segmento da trilha leva
   à fase correspondente.

   Nada aqui é conteúdo. Os textos moram nos <li> do HTML; este arquivo só
   mostra um de cada vez. Se ele não carregar, `html` não ganha `.js-flor`,
   a cena volta a ter altura automática e as cinco fases voltam a ser uma
   lista comum — legível e completa.

   Desenho, e não geometria de verdade: tudo é caminho SVG montado aqui.
   Não há imagem nenhuma para baixar.
   ========================================================================== */

(function () {
  'use strict';

  var alvo = document.getElementById('flor');
  var lista = document.getElementById('fasesLista');
  if (!alvo || !lista) return;

  var fases = Array.prototype.slice.call(lista.querySelectorAll('.fase'));
  var N = fases.length;
  if (!N) return;

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  var NS = 'http://www.w3.org/2000/svg';
  var CX = 320, CY = 320;

  /* Os três anéis. `giro` desloca o anel para as pétalas não se cobrirem;
     `atraso` faz o miolo abrir depois das pétalas de fora, como flor de
     verdade.

     Cada pétala fica SEMPRE no seu ângulo final: o que abre é o tamanho, e
     a largura abre mais tarde que o comprimento. Fechada, a flor é uma
     estrela de cinco espinhos; aberta, uma flor cheia — e em todo quadro do
     meio ela continua radialmente simétrica. A primeira versão girava cada
     pétala no seu próprio tempo e o meio da animação virava um cata-vento
     torto. Simetria em todo quadro é mais importante que o realismo do
     movimento. */
  var ANEIS = [
    { L: 252, W: 92, giro:  0, atraso: 0.00, cima: '#C77E92', baixo: '#9E4F66', traco: 'rgba(176,141,87,.55)' },
    { L: 186, W: 74, giro: 36, atraso: 0.08, cima: '#E7BCC6', baixo: '#C77E92', traco: 'rgba(176,141,87,.45)' },
    { L: 118, W: 52, giro: 18, atraso: 0.16, cima: '#FBF1F0', baixo: '#E7BCC6', traco: 'rgba(176,141,87,.35)' }
  ];

  /* ----------------------------------------------------------------- forma */

  /* Uma pétala apontando para cima, com a base na origem. */
  function caminhoPetala(L, W) {
    return 'M0,0' +
      ' C' + W + ',' + (-L * 0.30) + ' ' + (W * 0.86) + ',' + (-L * 0.80) + ' 0,' + (-L) +
      ' C' + (-W * 0.86) + ',' + (-L * 0.80) + ' ' + (-W) + ',' + (-L * 0.30) + ' 0,0' +
      ' Z';
  }

  function el(nome, atrs) {
    var e = document.createElementNS(NS, nome);
    for (var k in atrs) if (atrs.hasOwnProperty(k)) e.setAttribute(k, atrs[k]);
    return e;
  }

  /* ---------------------------------------------------------------- montar */

  var svg = el('svg', {
    viewBox: '0 0 640 640',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false'
  });

  var defs = el('defs', {});

  ANEIS.forEach(function (anel, r) {
    var g = el('linearGradient', { id: 'petala' + r, x1: '0', y1: '1', x2: '0', y2: '0' });
    g.appendChild(el('stop', { offset: '0%', 'stop-color': anel.baixo }));
    g.appendChild(el('stop', { offset: '100%', 'stop-color': anel.cima }));
    defs.appendChild(g);
  });

  var halo = el('radialGradient', { id: 'halo' });
  halo.appendChild(el('stop', { offset: '0%', 'stop-color': '#E7BCC6', 'stop-opacity': '.42' }));
  halo.appendChild(el('stop', { offset: '55%', 'stop-color': '#DCC08A', 'stop-opacity': '.14' }));
  halo.appendChild(el('stop', { offset: '100%', 'stop-color': '#DCC08A', 'stop-opacity': '0' }));
  defs.appendChild(halo);

  svg.appendChild(defs);

  /* halo difuso atrás de tudo */
  var gHalo = el('circle', { cx: CX, cy: CY, r: 300, fill: 'url(#halo)' });
  svg.appendChild(gHalo);

  /* aro de prata: fio tracejado que gira devagar — é a prata da paleta,
     usada como fio e não como área */
  var aro = el('circle', {
    cx: CX, cy: CY, r: 288,
    stroke: 'rgba(154,160,168,.5)', 'stroke-width': '1',
    'stroke-dasharray': '2 13', 'stroke-linecap': 'round'
  });
  var aroFino = el('circle', {
    cx: CX, cy: CY, r: 272,
    stroke: 'rgba(176,141,87,.28)', 'stroke-width': '1'
  });
  svg.appendChild(aro);
  svg.appendChild(aroFino);

  /* pétalas: de fora para dentro, para o miolo ficar por cima */
  var petalas = [];
  ANEIS.forEach(function (anel, r) {
    var d = caminhoPetala(anel.L, anel.W);
    for (var i = 0; i < N; i++) {
      var g = el('g', {});
      var corpo = el('path', {
        d: d,
        fill: 'url(#petala' + r + ')',
        stroke: anel.traco,
        'stroke-width': '1'
      });
      g.appendChild(corpo);
      /* nervura: um fio no meio da pétala. Custa um path e é o que tira o
         desenho do "chapado de vetor". */
      g.appendChild(el('path', {
        d: 'M0,-' + (anel.L * 0.10).toFixed(0) + ' L0,-' + (anel.L * 0.88).toFixed(0),
        stroke: 'rgba(158,79,102,.30)', 'stroke-width': '1', 'stroke-linecap': 'round'
      }));
      svg.appendChild(g);
      petalas.push({
        el: g, corpo: corpo, anel: anel, anelIdx: r, i: i,
        angulo: i * (360 / N) + anel.giro
      });
    }
  });

  /* miolo: estames em ouro */
  var gMiolo = el('g', {});
  for (var s = 0; s < 11; s++) {
    var a = (s / 11) * Math.PI * 2;
    var comp = 30 + (s % 3) * 9;
    var x = CX + Math.sin(a) * comp;
    var y = CY - Math.cos(a) * comp;
    gMiolo.appendChild(el('line', {
      x1: CX, y1: CY, x2: x.toFixed(1), y2: y.toFixed(1),
      stroke: '#B08D57', 'stroke-width': '1.4', 'stroke-linecap': 'round'
    }));
    gMiolo.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.4, fill: '#DCC08A' }));
  }
  gMiolo.appendChild(el('circle', { cx: CX, cy: CY, r: 10, fill: '#B08D57' }));
  svg.appendChild(gMiolo);

  alvo.appendChild(svg);

  /* ------------------------------------------------------------- desenhar */

  function limitar(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function suave(x) { return 1 - Math.pow(1 - x, 3); }          /* easeOutCubic */
  function degrau(a, b, x) { return limitar((x - a) / (b - a), 0, 1); }

  /* Quanto o anel já abriu, em 0..1. Todas as pétalas do MESMO anel abrem
     juntas — é o que mantém a simetria. Os anéis é que se atrasam entre si:
     de fora para dentro, como flor de verdade. */
  function abertura(t, atraso) {
    return suave(limitar((t - atraso) / (1 - atraso), 0, 1));
  }

  function desenhar(t, tempo, ativa) {
    /* a flor inteira gira um pouco enquanto abre: tira o ar de brasão */
    var giro = t * 14;

    for (var p = 0; p < petalas.length; p++) {
      var pet = petalas[p];
      var ab = abertura(t, pet.anel.atraso);

      /* a largura abre depois do comprimento: fechada é um espinho fino,
         aberta é uma pétala cheia */
      var sx = 0.16 + 0.84 * suave(limitar(ab * 1.15 - 0.15, 0, 1));
      var sy = 0.44 + 0.56 * ab;

      /* a pétala da fase que está sendo lida cresce um tico e clareia */
      var destaque = (pet.anelIdx === 0 && pet.i === ativa) ? 1 : 0;
      var escala = 1 + 0.055 * destaque;

      pet.el.setAttribute('transform',
        'translate(' + CX + ',' + CY + ') ' +
        'rotate(' + (pet.angulo + giro).toFixed(2) + ') ' +
        'scale(' + (sx * escala).toFixed(3) + ',' + (sy * escala).toFixed(3) + ')');
      pet.el.setAttribute('opacity', (0.55 + 0.45 * ab).toFixed(3));
      pet.corpo.setAttribute('stroke', destaque ? '#B08D57' : pet.anel.traco);
      pet.corpo.setAttribute('stroke-width', destaque ? '2' : '1');
    }

    /* o miolo aparece quando a flor já está quase toda aberta */
    gMiolo.setAttribute('opacity', degrau(0.55, 0.92, t).toFixed(3));
    gMiolo.setAttribute('transform',
      'translate(' + CX + ',' + CY + ') scale(' + (0.5 + 0.5 * degrau(0.5, 1, t)).toFixed(3) + ') ' +
      'translate(' + (-CX) + ',' + (-CY) + ')');

    var giroAro = t * 26 + (tempo || 0) * 1.6;
    aro.setAttribute('transform', 'rotate(' + giroAro.toFixed(2) + ' ' + CX + ' ' + CY + ')');
    aro.setAttribute('opacity', (0.25 + 0.6 * t).toFixed(3));
    aroFino.setAttribute('opacity', (0.15 + 0.5 * t).toFixed(3));

    gHalo.setAttribute('opacity', (0.25 + 0.75 * t).toFixed(3));
  }

  /* --------------------------------------------------------------- trilha */

  var trilha = document.createElement('div');
  trilha.className = 'fases__trilha';
  var botoes = [];

  fases.forEach(function (fase, i) {
    fase.setAttribute('data-indice', ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + N).slice(-2));

    var b = document.createElement('button');
    b.type = 'button';
    var nome = fase.getAttribute('data-fase') || ('Fase ' + (i + 1));
    b.innerHTML = '<span>Ir para: ' + nome + '</span>';
    b.addEventListener('click', function () { irPara(i); });
    trilha.appendChild(b);
    botoes.push(b);
  });

  lista.parentNode.insertBefore(trilha, lista.nextSibling);
  lista.setAttribute('data-pronto', '');

  /* ------------------------------------------------------------- rolagem */

  var cena = lista.closest('.fases__cena');
  var ativa = -1;

  function marcar(i) {
    if (i === ativa) return;
    ativa = i;
    for (var k = 0; k < N; k++) {
      fases[k].classList.toggle('is-ativa', k === i);
      botoes[k].classList.toggle('is-ativa', k === i);
      botoes[k].setAttribute('aria-current', k === i ? 'true' : 'false');
    }
  }

  function percurso() {
    return Math.max(1, cena.offsetHeight - window.innerHeight);
  }

  function progresso() {
    var topo = cena.getBoundingClientRect().top;
    return limitar(-topo / percurso(), 0, 1);
  }

  function irPara(i) {
    var alvoY = cena.getBoundingClientRect().top + window.scrollY +
                percurso() * ((i + 0.55) / N);
    window.scrollTo({ top: alvoY, behavior: semMovimento.matches ? 'auto' : 'smooth' });
  }

  /* ------------------------------------------------------------- arranque */

  document.documentElement.classList.add('js-flor');

  if (semMovimento.matches) {
    /* aberta de uma vez, sem laço: a imagem continua lá, só não se mexe */
    desenhar(1, 0, -1);
    marcar(0);
    fases.forEach(function (f) { f.classList.add('is-ativa'); });
    return;
  }

  var visivel = false;
  var pedido = 0;
  var relogio = 0;
  var ultimo = 0;
  var tAtual = 0;
  var tAlvo = 0;

  function quadro(agora) {
    pedido = 0;
    if (ultimo) relogio += Math.min(0.05, (agora - ultimo) / 1000);
    ultimo = agora;

    tAtual += (tAlvo - tAtual) * 0.12;
    desenhar(tAtual, relogio, ativa);

    /* segue enquanto ainda estiver assentando ou enquanto o aro gira */
    if (visivel) pedir();
  }

  function pedir() { if (!pedido) pedido = requestAnimationFrame(quadro); }

  function aoRolar() {
    tAlvo = progresso();
    marcar(Math.min(N - 1, Math.floor(tAlvo * N)));
    if (visivel) pedir();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visivel = e[0].isIntersecting;
      if (visivel) { ultimo = 0; pedir(); }
      else if (pedido) { cancelAnimationFrame(pedido); pedido = 0; }
    }, { rootMargin: '10% 0px' }).observe(cena);
  } else {
    visivel = true; pedir();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (pedido) { cancelAnimationFrame(pedido); pedido = 0; } }
    else if (visivel) { ultimo = 0; pedir(); }
  });

  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar, { passive: true });

  aoRolar();
  tAtual = tAlvo;
  desenhar(tAtual, 0, ativa);
})();
