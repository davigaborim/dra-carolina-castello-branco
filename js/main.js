/* ==========================================================================
   DRA. CAROLINA — comportamento da página

     1. Cabeçalho, menu e link ativo
     2. Revelação no scroll
     3. Fio de progresso e parallax
     4. Inclinação 3D das cartas
     5. Orientações (acordeão)
     6. Utilidades e gancho de medição

   Nada aqui é essencial: sem este arquivo o site continua inteiro e legível.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pontFino = window.matchMedia('(hover:hover) and (pointer:fine)');

  function limitar(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* ======================================================================
     1. CABEÇALHO, MENU E LINK ATIVO
     ====================================================================== */

  var topo = document.getElementById('topo');
  var nav = document.getElementById('nav');
  var burger = document.getElementById('hamburguer');

  function fecharMenu() {
    if (!nav) return;
    nav.classList.remove('is-aberto');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-aberto');
      burger.setAttribute('aria-expanded', String(aberto));
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', fecharMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (nav && nav.classList.contains('is-aberto')) { fecharMenu(); burger.focus(); return; }
    var aberta = document.querySelector('.guia[open]');
    if (aberta) { aberta.removeAttribute('open'); aberta.querySelector('summary').focus(); }
  });

  /* O cabeçalho só ganha fundo depois da abertura: sobre a faixa escura ele
     é transparente com texto claro, e translúcido ali pegaria a seda por
     trás e viraria uma barra suja. */
  var abertura = document.querySelector('.abertura');

  function ajustarTopo() {
    if (!topo) return;
    var limite = abertura ? Math.max(60, abertura.offsetHeight - 200) : 60;
    topo.classList.toggle('is-preso', window.scrollY > limite);
  }

  window.addEventListener('scroll', ajustarTopo, { passive: true });
  window.addEventListener('resize', ajustarTopo, { passive: true });
  ajustarTopo();

  /* link ativo conforme a seção visível */
  var secoes = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var links = {};
  if (nav) {
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
  }

  if ('IntersectionObserver' in window && secoes.length) {
    var vistas = {};
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { vistas[e.target.id] = e.isIntersecting; });
      var atual = null;
      for (var i = 0; i < secoes.length; i++) {
        if (vistas[secoes[i].id]) { atual = secoes[i].id; break; }
      }
      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-atual', id === atual);
      });
    }, { rootMargin: '-46% 0px -46% 0px' });

    secoes.forEach(function (s) { espia.observe(s); });
  }

  /* ======================================================================
     2. REVELAÇÃO NO SCROLL
     ====================================================================== */

  var aRevelar = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !semMovimento.matches) {
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-vista');
        olho.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

    aRevelar.forEach(function (el) { olho.observe(el); });
  } else {
    aRevelar.forEach(function (el) { el.classList.add('is-vista', 'is-limpo'); });
  }

  /* Assim que a entrada acaba, tira o `filter`: ele mantém uma camada de
     composição ligada pra sempre e amolece o texto na GPU. A folga de 300ms
     é porque o transform dura um pouco mais que a opacidade. */
  document.addEventListener('transitionend', function (e) {
    var el = e.target;
    if (e.propertyName !== 'opacity') return;
    if (!el.classList || !el.classList.contains('is-vista')) return;
    setTimeout(function () { el.classList.add('is-limpo'); }, 300);
  }, true);

  /* ======================================================================
     3. FIO DE PROGRESSO E PARALLAX
     O deslocamento é escrito numa variável CSS (--px) em vez de num
     transform direto: assim não briga com o scale das fotos nem com o
     transform de hover das cartas.
     ====================================================================== */

  var barra = document.getElementById('progresso');
  var deslizantes = Array.prototype.slice.call(document.querySelectorAll('[data-desliza]'));
  var sujo = true, laco = 0;

  function passo() {
    laco = 0;
    if (!sujo) return;
    sujo = false;

    if (barra) {
      var alcance = document.documentElement.scrollHeight - window.innerHeight;
      var t = alcance > 0 ? limitar(window.scrollY / alcance, 0, 1) : 0;
      barra.style.transform = 'scaleX(' + t.toFixed(4) + ')';
    }

    if (semMovimento.matches) return;

    var meio = window.innerHeight / 2;
    for (var i = 0; i < deslizantes.length; i++) {
      var el = deslizantes[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;

      var fator = parseFloat(el.getAttribute('data-desliza')) || 0;
      var limite = parseFloat(el.getAttribute('data-desliza-max')) || 40;
      var centro = r.top + r.height / 2;
      var y = limitar((centro - meio) / window.innerHeight * fator * 100, -limite, limite);
      el.style.setProperty('--px', y.toFixed(2) + 'px');
    }
  }

  function marcar() {
    sujo = true;
    if (!laco) laco = requestAnimationFrame(passo);
  }

  window.addEventListener('scroll', marcar, { passive: true });
  window.addEventListener('resize', marcar, { passive: true });
  marcar();

  /* ======================================================================
     4. INCLINAÇÃO 3D
     Só em quem tem mouse de verdade: no celular seria um transform morto
     ocupando camada de composição.
     ====================================================================== */

  if (pontFino.matches && !semMovimento.matches) {
    document.querySelectorAll('[data-inclina]').forEach(function (el) {
      var forca = parseFloat(el.getAttribute('data-inclina')) || 4;
      var dentro = false;

      el.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--tx', ((x - 0.5) * 2 * forca).toFixed(2) + 'deg');
        el.style.setProperty('--ty', ((0.5 - y) * 2 * forca).toFixed(2) + 'deg');
        el.style.setProperty('--bx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--by', (y * 100).toFixed(1) + '%');
        if (!dentro) { dentro = true; el.classList.add('is-inclinado'); }
      });

      function sair() {
        dentro = false;
        el.classList.remove('is-inclinado');
        el.style.removeProperty('--tx');
        el.style.removeProperty('--ty');
      }
      el.addEventListener('pointerleave', sair);
      el.addEventListener('blur', sair, true);
    });
  }

  /* ======================================================================
     5. ORIENTAÇÕES — uma aberta por vez
     ====================================================================== */

  var guias = Array.prototype.slice.call(document.querySelectorAll('.guia'));
  guias.forEach(function (g) {
    g.addEventListener('toggle', function () {
      if (!g.open) return;
      guias.forEach(function (o) { if (o !== g) o.removeAttribute('open'); });
    });
  });

  /* ======================================================================
     6. UTILIDADES E GANCHO DE MEDIÇÃO
     ====================================================================== */

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* Todo clique em WhatsApp dispara um evento, SE houver uma ferramenta de
     medição na página. É esse número que sustenta a conversa de renovação —
     ver LEIA-ME.md, "Medição". Sem ferramenta instalada, não faz nada. */
  document.querySelectorAll('[data-zap]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        if (typeof window.plausible === 'function') window.plausible('WhatsApp');
        else if (typeof window.gtag === 'function') window.gtag('event', 'contato_whatsapp');
        else if (window.umami && typeof window.umami.track === 'function') window.umami.track('whatsapp');
      } catch (_) { /* medição nunca pode quebrar o clique */ }
    });
  });
})();
