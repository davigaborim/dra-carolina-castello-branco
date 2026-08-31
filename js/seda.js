/* ==========================================================================
   A SEDA — WebGL1 puro, sem biblioteca nenhuma

   As duas faixas escuras do site (a abertura e o contato) têm um tecido
   correndo por trás do texto: ruído com domain warping, que é o que faz a
   coisa ler como seda dobrada e não como fumaça. O fio de ouro são as
   cristas finas das dobras.

   Cada elemento com [data-seda] ganha o seu canvas. Só desenha o que está
   na tela — fora dela o rAF nem roda, e a aba escondida derruba o laço
   inteiro. Sem WebGL o canvas é removido e fica o gradiente do CSS.

   TRÊS COISAS QUE TRAVAVAM O TECIDO EM OUTROS NAVEGADORES:

     1. Contexto perdido. O navegador pode tomar o contexto WebGL de volta a
        qualquer momento (troca de GPU no notebook, driver que reinicia, abas
        demais com WebGL abertas). Quando isso acontece o drawArrays vira um
        nada silencioso e o canvas fica pra sempre no último quadro pintado —
        travado, sem erro nenhum no console. Agora ouvimos
        webglcontextlost/restored e remontamos; se não voltar, o canvas sai
        e fica o gradiente, que é honesto.

     2. Volta pelo botão "voltar". Safari e Firefox guardam a página inteira
        (bfcache) e nem sempre disparam visibilitychange na volta — o laço
        tinha sido desligado e nunca mais religava. Agora `pageshow` religa.

     3. GPU lenta ou desenho por software. Este shader faz 15 avaliações de
        ruído por pixel; numa máquina sem aceleração ele roda a dois quadros
        por segundo, o que o visitante lê como "travado". Agora medimos o
        tempo de quadro e baixamos a resolução; se ainda assim não der,
        paramos num quadro parado — parado é bonito, engasgado não é.

   Ajustes por atributo, todos opcionais:
     data-seda-velocidade  0.42  o quão rápido o tecido anda
     data-seda-escala      1.15  zoom: maior = dobra mais fina
     data-seda-semente     41    muda o desenho sem mudar o resto
     data-seda-resolucao   0.55  fração da tela em que ele desenha
   ========================================================================== */

(function () {
  'use strict';

  var alvos = document.querySelectorAll('[data-seda]');
  if (!alvos.length) return;

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var VERTEX = [
    'attribute vec2 a_pos;',
    'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }'
  ].join('\n');

  /* Uniforms empacotados em dois vec4: cabe folgado no mínimo garantido do
     WebGL1 e as macros mantêm o código legível. */
  var FRAGMENT = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    '',
    'uniform vec4 u_cena;   // resolucao.xy, tempo, semente',
    'uniform vec4 u_par;    // velocidade, escala, deriva, --',
    '',
    '#define u_res   u_cena.xy',
    '#define u_tempo u_cena.z',
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    '#define u_semente u_cena.w',
    '#else',
    '#define u_semente mod(u_cena.w, 29.0)',
    '#endif',
    '#define u_vel    u_par.x',
    '#define u_escala u_par.y',
    '#define u_deriva u_par.z',
    '',
    'float hash21(vec2 p){',
    '#ifndef GL_FRAGMENT_PRECISION_HIGH',
    '  p = mod(p, 29.0);',
    '#endif',
    '  p = fract(p * vec2(233.34, 431.35));',
    '  p += dot(p, p + 29.17);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    'float ruido(vec2 p){',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash21(i), hash21(i + vec2(1.0,0.0)), u.x),',
    '             mix(hash21(i + vec2(0.0,1.0)), hash21(i + vec2(1.0,1.0)), u.x), u.y);',
    '}',
    '',
    'float fbm(vec2 p){',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++){',
    '    v += a * ruido(p);',
    '    p = p * 2.02 + vec2(13.7, 7.3);',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'void main(){',
    '  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);',
    '  p *= u_escala;',
    '  p += vec2(u_semente * 0.37, u_semente * 0.19 + u_deriva);',
    '  float t = u_tempo * u_vel;',
    '',
    /* domain warping: o campo é distorcido por ele mesmo, duas vezes.
       É isso que dobra o tecido em vez de só borrar. */
    '  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));',
    '  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.14 * t),',
    '                fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.11 * t));',
    '  float v = fbm(p + 3.2 * r);',
    '',
    '  vec3 fundo  = vec3(0.106, 0.047, 0.078);',   /* #1B0C14 */
    '  vec3 vinho  = vec3(0.231, 0.114, 0.169);',   /* #3B1D2B */
    '  vec3 rosaEs = vec3(0.620, 0.310, 0.400);',   /* #9E4F66 */
    '  vec3 rosa   = vec3(0.780, 0.494, 0.573);',   /* #C77E92 */
    '  vec3 ouro   = vec3(0.863, 0.753, 0.541);',   /* #DCC08A */
    '',
    '  vec3 cor = mix(fundo, vinho, smoothstep(0.14, 0.58, v));',
    '  cor = mix(cor, rosaEs, smoothstep(0.46, 0.88, v) * 0.72);',
    '  cor = mix(cor, rosa,   smoothstep(0.74, 1.02, v) * 0.42);',
    '',
    /* o brilho da seda: cristas MUITO finas nas dobras, senão vira glitter */
    '  float fio = pow(abs(sin(v * 9.0 + length(r) * 2.6)), 24.0);',
    '  cor += ouro * fio * 0.55;',
    '',
    '  float d = length(p - vec2(u_semente * 0.37, u_semente * 0.19 + u_deriva));',
    '  cor *= 0.42 + 0.66 * smoothstep(1.45, 0.05, d);',
    '',
    /* grão: sem ele o degradê faz faixas em tela de 8 bits */
    '  cor += (hash21(gl_FragCoord.xy) - 0.5) * 0.024;',
    '',
    '  gl_FragColor = vec4(max(cor, 0.0), 1.0);',
    '}'
  ].join('\n');

  var OPCOES = {
    antialias: false, alpha: false, depth: false, stencil: false,
    powerPreference: 'low-power'
  };

  function compilar(gl, tipo, fonte) {
    var s = gl.createShader(tipo);
    gl.shaderSource(s, fonte);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function montar(alvo) {
    var canvas = document.createElement('canvas');
    canvas.className = 'seda-tela';
    canvas.setAttribute('aria-hidden', 'true');

    var gl = null, uCena = null, uPar = null;
    var perdido = false, morto = false, volta = 0;

    try {
      gl = canvas.getContext('webgl', OPCOES) || canvas.getContext('experimental-webgl', OPCOES);
    } catch (_) { gl = null; }
    if (!gl) return null;

    /* Tudo que vive dentro do contexto: shader, programa, buffer, uniforms.
       Perder o contexto apaga tudo isso, então precisa ser remontável. */
    function montarPrograma() {
      var vs = compilar(gl, gl.VERTEX_SHADER, VERTEX);
      var fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      if (!vs || !fs) return false;

      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      uCena = gl.getUniformLocation(prog, 'u_cena');
      uPar = gl.getUniformLocation(prog, 'u_par');
      return true;
    }

    if (!montarPrograma()) return null;

    function num(nome, padrao) {
      var v = parseFloat(alvo.getAttribute('data-seda-' + nome));
      return isNaN(v) ? padrao : v;
    }

    var velocidade = num('velocidade', 0.42);
    var escala = num('escala', 1.15);
    var semente = num('semente', 41);
    var resolucao = Math.min(1, Math.max(0.25, num('resolucao', 0.55)));

    alvo.insertBefore(canvas, alvo.firstChild);

    var L = 0, A = 0;

    function medir() {
      var l = Math.max(1, Math.round(alvo.clientWidth * DPR * resolucao));
      var a = Math.max(1, Math.round(alvo.clientHeight * DPR * resolucao));
      if (l === L && a === A) return;
      L = l; A = a;
      canvas.width = L;
      canvas.height = A;
      gl.viewport(0, 0, L, A);
    }

    medir();
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(alvo);

    function desistir() {
      morto = true;
      perdido = true;
      clearTimeout(volta);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    /* Sem o preventDefault o navegador NUNCA restaura o contexto. */
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      perdido = true;
      clearTimeout(volta);
      /* Se em 6s não voltou, é porque não vai voltar. Melhor o gradiente do
         CSS do que um quadro congelado fingindo que é animação. */
      volta = setTimeout(desistir, 6000);
    }, false);

    canvas.addEventListener('webglcontextrestored', function () {
      clearTimeout(volta);
      if (morto) return;
      if (!montarPrograma()) { desistir(); return; }
      L = 0; A = 0;            /* força medir() a reaplicar o viewport */
      medir();
      perdido = false;
    }, false);

    return {
      alvo: alvo,
      visivel: false,
      viva: function () { return !morto && !perdido && !gl.isContextLost(); },
      /* Baixa a resolução quando a máquina não dá conta. Devolve false
         quando já está no fundo do poço e não há mais o que afrouxar. */
      afrouxar: function () {
        if (morto || resolucao <= 0.26) return false;
        resolucao = Math.max(0.25, resolucao * 0.7);
        L = 0; A = 0;
        if (!perdido) medir();
        return true;
      },
      desenhar: function (tempo) {
        if (morto || perdido || gl.isContextLost()) return;
        medir();
        /* a rolagem empurra o tecido devagar: dá profundidade sem parallax */
        var r = alvo.getBoundingClientRect();
        var deriva = (r.top / Math.max(1, window.innerHeight)) * 0.16;
        gl.uniform4f(uCena, L, A, tempo, semente);
        gl.uniform4f(uPar, velocidade, escala, deriva, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      perder: desistir
    };
  }

  /* ------------------------------------------------- laço único pra todos */

  var telas = [];
  Array.prototype.forEach.call(alvos, function (a) {
    var t = montar(a);
    if (t) telas.push(t);
  });
  if (!telas.length) return;      /* sem WebGL: fica o gradiente do CSS */

  var relogio = 0, ultimo = 0, rodando = false, pedido = 0;

  /* Vigia de desempenho: conta quadros lentos numa janela e, se a máquina
     não sustenta ~30fps, baixa a resolução de todas as telas. Três janelas
     ruins sem melhora e o tecido para num quadro parado. */
  var lentos = 0, contados = 0, quedas = 0;

  function algumaVisivel() {
    for (var i = 0; i < telas.length; i++) {
      if (telas[i].visivel && telas[i].viva()) return true;
    }
    return false;
  }

  function pesar(dt) {
    contados++;
    if (dt > 0.034) lentos++;
    if (contados < 48) return;

    var ruim = lentos > 30;
    contados = 0; lentos = 0;
    if (!ruim) { quedas = 0; return; }

    quedas++;
    var afrouxou = false;
    for (var i = 0; i < telas.length; i++) {
      if (telas[i].afrouxar()) afrouxou = true;
    }
    if (!afrouxou || quedas >= 3) desligar();
  }

  function quadro(agora) {
    if (!rodando) return;
    var dt = 0;
    if (ultimo) { dt = Math.min(0.05, (agora - ultimo) / 1000); relogio += dt; }
    ultimo = agora;

    for (var i = 0; i < telas.length; i++) {
      if (telas[i].visivel) telas[i].desenhar(relogio);
    }

    if (dt) pesar(dt);
    if (!rodando) return;                 /* pesar() pode ter desligado */
    pedido = requestAnimationFrame(quadro);
  }

  function ligar() {
    if (rodando || semMovimento.matches || document.hidden || !algumaVisivel()) return;
    rodando = true; ultimo = 0;
    pedido = requestAnimationFrame(quadro);
  }

  function desligar() {
    rodando = false;
    if (pedido) cancelAnimationFrame(pedido);
    pedido = 0;
  }

  /* Movimento reduzido: um quadro parado e mais nada. O tecido continua lá,
     só não se mexe. */
  function quadroParado() {
    telas.forEach(function (t) { if (t.viva()) t.desenhar(0); });
  }

  if ('IntersectionObserver' in window) {
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        for (var i = 0; i < telas.length; i++) {
          if (telas[i].alvo === e.target) telas[i].visivel = e.isIntersecting;
        }
      });
      if (semMovimento.matches) quadroParado();
      else if (algumaVisivel()) ligar();
      else desligar();
    }, { rootMargin: '12% 0px' });
    telas.forEach(function (t) { olho.observe(t.alvo); });
  } else {
    telas.forEach(function (t) { t.visivel = true; });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) desligar(); else ligar();
  });

  /* Volta pelo botão "voltar": Safari e Firefox devolvem a página do bfcache
     sem disparar visibilitychange, e o laço ficava desligado pra sempre —
     que é exatamente o "fundo travado" que apareceu no outro navegador. */
  window.addEventListener('pageshow', function () { ligar(); });
  window.addEventListener('focus', function () { ligar(); });

  if (semMovimento.addEventListener) {
    semMovimento.addEventListener('change', function () {
      if (semMovimento.matches) { desligar(); quadroParado(); } else ligar();
    });
  } else if (semMovimento.addListener) {          /* Safari antigo */
    semMovimento.addListener(function () {
      if (semMovimento.matches) { desligar(); quadroParado(); } else ligar();
    });
  }

  if (semMovimento.matches) quadroParado(); else ligar();
})();
