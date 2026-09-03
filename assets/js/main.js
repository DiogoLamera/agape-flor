/* =========================================================
   Ágape Floricultura — comportamento da landing page
   Sem dependências. Tudo roda depois do parse (script defer).
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIGURAÇÃO
     --------------------------------------------------------- */

  // Celular do perfil da loja no Google, no formato 55 + DDD + número.
  // A página do Facebook da loja divulga esse mesmo número como WhatsApp.
  var WHATSAPP = '5531983031214';

  // TODO: NOMES E DESCRIÇÕES SÃO FICTÍCIOS — substituir pelos arranjos reais.
  // As fotos são do Pexels; troque por fotos da loja em assets/img/.
  // O nome curto é o que aparece na fita grande, então cabe uma palavra só.
  var BUQUES = [
    {
      nome: 'Girassol', tipo: 'Buquê pronto', foto: '12272311',
      texto: 'Girassóis abertos com rosas e folhagem, embalados em papel kraft. ' +
             'É o buquê que ilumina a mesa e não pede ocasião.'
    },
    {
      nome: 'Peônia', tipo: 'Buquê pronto', foto: '3392982',
      texto: 'Peônias em papel claro, poucas flores e muito volume. Para pedir ' +
             'desculpas, dizer sim ou simplesmente chegar com flor na mão.'
    },
    {
      nome: 'Esmeralda', tipo: 'Buquê assinatura', foto: '34990301',
      texto: 'Flores da estação em papel verde escuro, com laço de cetim. ' +
             'Composição mais fechada, para presente de peso.'
    },
    {
      nome: 'Jardim', tipo: 'Planta em vaso', foto: '21750830',
      texto: 'Suculentas, cactos e ornamentais de vaso. Presente que fica, ' +
             'com orientação de rega e de sol na hora da entrega.'
    },
    {
      nome: 'Secas', tipo: 'Arranjo seco', foto: '18088260',
      texto: 'Composição em tons secos, com folhagem e flores desidratadas. ' +
             'Dura meses e não precisa de água.'
    }
  ];

  /* --------------------------------------------------------- */

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(s));
  };

  function urlFoto(id, largura) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id +
           '.jpeg?auto=compress&cs=tinysrgb&w=' + largura;
  }

  /* === Links de WhatsApp ===
     Cada elemento com data-wa vira um link com a mensagem já escrita. */
  function aplicarZap(escopo) {
    $$('[data-wa]', escopo).forEach(function (el) {
      el.href = 'https://wa.me/' + WHATSAPP + '?text=' +
                encodeURIComponent(el.getAttribute('data-wa'));
      el.target = '_blank';
      el.rel = 'noopener';
    });
  }

  /* === Menu em tela estreita === */
  (function menu() {
    var botao = $('#menuBt');
    var nav = $('#nav');
    if (!botao || !nav) return;

    function fechar() {
      nav.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    }

    function abrir() {
      nav.classList.add('aberto');
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu');
      document.body.style.overflow = 'hidden';
      var primeiro = nav.querySelector('a');
      if (primeiro) primeiro.focus();
    }

    botao.addEventListener('click', function () {
      nav.classList.contains('aberto') ? fechar() : abrir();
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('aberto')) return;

      if (e.key === 'Escape') {
        fechar();
        botao.focus();
        return;
      }

      // Prende o foco no menu enquanto ele estiver aberto.
      if (e.key === 'Tab') {
        var focaveis = [botao].concat($$('a', nav));
        var i = focaveis.indexOf(document.activeElement);
        var proximo = e.shiftKey ? i - 1 : i + 1;
        if (i === -1 || proximo < 0 || proximo >= focaveis.length) {
          e.preventDefault();
          focaveis[e.shiftKey ? focaveis.length - 1 : 0].focus();
        }
      }
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) fechar();
    });
  })();

  /* === Vitrine: a fita de nomes e a ficha andam juntas === */
  (function vitrine() {
    var trilho = $('#fitaTrilho');
    var fita = trilho && trilho.parentElement;
    var foto = $('#fichaFoto');
    if (!trilho || !foto) return;

    var tipo = $('#fichaTipo');
    var nome = $('#fichaNome');
    var texto = $('#fichaTexto');
    var link = $('#fichaLink');
    var aviso = $('#fichaAviso');
    var indice = 0;
    var palavras = [];

    // A lista entra três vezes: assim sempre há nome à esquerda e à direita do
    // ativo, e a fita parece não ter começo nem fim. O ativo é sempre o da
    // cópia do meio.
    var COPIAS = 3;
    for (var c = 0; c < COPIAS; c++) {
      BUQUES.forEach(function (b, i) {
        var li = document.createElement('li');
        li.textContent = b.nome;
        li.addEventListener('click', function () { ir(i); });
        trilho.appendChild(li);
        palavras.push(li);
      });
    }

    function noMeio(i) { return BUQUES.length + i; }

    function centralizar() {
      var alvo = palavras[noMeio(indice)];
      if (!alvo) return;
      // desloca o trilho até o nome ativo ficar no meio da janela da fita
      var meioFita = fita.getBoundingClientRect().width / 2;
      var meioPalavra = alvo.offsetLeft + alvo.offsetWidth / 2;
      trilho.style.transform = 'translate3d(' + (meioFita - meioPalavra).toFixed(1) + 'px,0,0)';
    }

    function pintar() {
      palavras.forEach(function (p, i) {
        p.classList.toggle('ativo', i === noMeio(indice));
      });

      var b = BUQUES[indice];
      tipo.textContent = b.tipo;
      nome.textContent = '«' + b.nome + '»';
      texto.textContent = b.texto;
      link.setAttribute('data-wa', 'Olá! Tenho interesse no ' +
                        b.tipo.toLowerCase() + ' ' + b.nome + '.');
      aplicarZap(link.parentElement);
      if (aviso) aviso.textContent = b.nome + ', ' + (indice + 1) + ' de ' + BUQUES.length;

      // troca a foto com um respiro, para não piscar entre uma e outra
      foto.classList.add('trocando');
      var nova = new Image();
      nova.onload = nova.onerror = function () {
        foto.src = nova.src;
        foto.alt = b.tipo + ' ' + b.nome;
        foto.classList.remove('trocando');
      };
      nova.src = urlFoto(b.foto, 900);

      centralizar();
    }

    function ir(i) {
      indice = (i + BUQUES.length) % BUQUES.length;   // gira sem fim
      pintar();
    }

    $('#setaAnterior').addEventListener('click', function () { ir(indice - 1); });
    $('#setaProximo').addEventListener('click', function () { ir(indice + 1); });

    fita.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(indice - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(indice + 1); }
    });

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(centralizar, 150);
    });

    pintar();
    // as larguras mudam quando a fonte carrega, e a conta do centro muda junto
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(centralizar);
  })();

  /* === Parallax da capa ===
     A foto anda mais devagar que a página e o título anda um pouco contra:
     as duas camadas se aproximam durante a rolagem, em vez de subirem juntas
     como um bloco só. Um rAF por quadro, e nada disso roda em
     prefers-reduced-motion. */
  (function parallaxCapa() {
    var capa = $('.capa');
    var foto = $('.capa__foto');
    var marca = $('.capa__marca');
    if (!capa || !foto || !marca || reduzido) return;

    var pendente = false;

    function ao() {
      var y = window.scrollY || window.pageYOffset;
      if (y < window.innerHeight * 1.3) {
        foto.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0)';
        marca.style.transform = 'translate3d(0,' + (y * -0.07).toFixed(1) + 'px,0)';
      }
      pendente = false;
    }

    window.addEventListener('scroll', function () {
      if (!pendente) {
        pendente = true;
        window.requestAnimationFrame(ao);
      }
    }, { passive: true });
    ao();
  })();

  /* === Entrada ao chegar na tela === */
  (function revela() {
    var alvos = $$('[data-revela],[data-sobe]');
    if (!('IntersectionObserver' in window) || reduzido) {
      alvos.forEach(function (el) { el.classList.add('visivel'); });
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        io.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });

    alvos.forEach(function (el) { io.observe(el); });
  })();

  /* === Horários: destaca o dia e diz se está aberto agora === */
  (function horarios() {
    var agora = new Date();
    var dia = agora.getDay();
    var minutos = agora.getHours() * 60 + agora.getMinutes();

    var linha = $('#horarios li[data-dia="' + dia + '"]');
    if (linha) linha.classList.add('hoje');

    // seg–sex 09:00–19:00 · sáb 09:00–17:00 · dom 09:00–12:00
    var fecha = dia === 0 ? 12 * 60 : (dia === 6 ? 17 * 60 : 19 * 60);
    var aberto = minutos >= 9 * 60 && minutos < fecha;

    var estado = $('#estadoLoja');
    if (estado) {
      estado.textContent = aberto ? 'Aberto agora' : 'Fechado no momento';
      estado.classList.toggle('fechada', !aberto);
    }
  })();

  /* === Rodapé === */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  aplicarZap(document);
})();
