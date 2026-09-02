/* =========================================================
   Ágape Floricultura — comportamento da landing page
   Sem dependências. Tudo roda depois do parse (script defer).
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIGURAÇÃO — ajuste estes dois blocos e o site está seu
     --------------------------------------------------------- */

  // Celular do perfil da loja no Google, no formato 55 + DDD + número.
  // O Facebook da loja divulga esse mesmo número como WhatsApp.
  var WHATSAPP = '5531983031214';

  // TODO: PREÇOS E DESCRIÇÕES SÃO FICTÍCIOS — substituir pelos itens reais.
  // As fotos são do Pexels e do Unsplash; troque por fotos da loja em assets/img/.
  var ITENS = [
    {
      nome: 'Buquê de Girassóis', preco: 'R$ 159', marca: 'mais pedido',
      desc: 'Girassóis com rosas e folhagem, embalado em papel kraft.',
      foto: 'px:12272311'
    },
    {
      nome: 'Peônias na Seda', preco: 'R$ 229', marca: '',
      desc: 'Peônias em embalagem clara, para pedir desculpas ou dizer sim.',
      foto: 'px:3392982'
    },
    {
      nome: 'Buquê Esmeralda', preco: 'R$ 199', marca: 'assinatura',
      desc: 'Flores da estação em papel verde escuro, com laço de cetim.',
      foto: 'px:34990301'
    },
    {
      nome: 'Mudas Ornamentais', preco: 'R$ 35', marca: '',
      desc: 'Mudas prontas para o vaso ou para o canteiro, várias espécies.',
      foto: 'px:22610800'
    },
    {
      nome: 'Rosas do Dia', preco: 'R$ 119', marca: '',
      desc: 'Rosas colhidas na semana, montadas do tamanho que você quiser.',
      // pos: enquadramento opcional, para o corte 4:3 não cair no vazio da foto
      foto: 'un:photo-1691600351187-c42ae2510997', pos: '22% 82%'
    },
    {
      nome: 'Cesta de Flores Secas', preco: 'R$ 149', marca: 'dura meses',
      desc: 'Composição em tons secos, para quem quer um presente duradouro.',
      foto: 'un:photo-1543157145-f78c636d023d'
    }
  ];

  /* --------------------------------------------------------- */

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(s));
  };

  /* As fotos vêm de dois bancos: o prefixo diz de qual montar a URL. */
  function urlFoto(id, largura) {
    if (id.indexOf('px:') === 0) {
      var n = id.slice(3);
      return 'https://images.pexels.com/photos/' + n + '/pexels-photo-' + n +
             '.jpeg?auto=compress&cs=tinysrgb&w=' + largura;
    }
    return 'https://images.unsplash.com/' + id.slice(3) +
           '?auto=format&fit=crop&q=72&w=' + largura;
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

  /* === Cabeçalho ganha borda depois do topo === */
  (function cabecalho() {
    var topo = $('#topo');
    if (!topo) return;
    var pendente = false;

    function ao() {
      topo.classList.toggle('fixado', (window.scrollY || window.pageYOffset) > 24);
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

  /* === Menu em tela estreita === */
  (function menu() {
    var botao = $('#sanduiche');
    var nav = $('#menu');
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

  /* === Catálogo em grade === */
  (function catalogo() {
    var grade = $('#grade');
    if (!grade) return;

    ITENS.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'item';
      li.innerHTML =
        '<div class="item__foto">' +
          '<img src="' + urlFoto(item.foto, 640) + '" ' +
               'srcset="' + urlFoto(item.foto, 420) + ' 420w, ' +
                            urlFoto(item.foto, 640) + ' 640w, ' +
                            urlFoto(item.foto, 900) + ' 900w" ' +
               'sizes="(max-width:640px) 92vw, (max-width:1100px) 46vw, 30vw" ' +
               'width="640" height="480" loading="lazy" decoding="async" ' +
               (item.pos ? 'style="object-position:' + item.pos + '" ' : '') +
               'alt="' + item.nome + '">' +
          (item.marca ? '<span class="item__marca">' + item.marca + '</span>' : '') +
        '</div>' +
        '<div class="item__corpo">' +
          '<div class="item__topo">' +
            '<h3 class="item__nome">' + item.nome + '</h3>' +
            '<span class="item__preco">' + item.preco + '</span>' +
          '</div>' +
          '<p class="item__desc">' + item.desc + '</p>' +
          '<a class="item__pedir" href="#" data-wa="Olá! Tenho interesse em: ' +
            item.nome + ' (' + item.preco + ').">Pedir pelo zap</a>' +
        '</div>';
      li.setAttribute('data-revela', '');
      grade.appendChild(li);
    });

    aplicarZap(grade);
  })();

  /* === Entrada ao chegar na tela === */
  (function revela() {
    var alvos = $$('[data-revela]');
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

    // O escalonamento é por grupo de irmãos, não pela ordem global da página.
    var porPai = new Map();
    alvos.forEach(function (el) {
      var lista = porPai.get(el.parentElement) || [];
      lista.push(el);
      porPai.set(el.parentElement, lista);
    });
    porPai.forEach(function (lista) {
      lista.forEach(function (el, i) {
        el.style.setProperty('--atraso', Math.min(i * 80, 400) + 'ms');
      });
    });

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
