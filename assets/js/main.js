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
  // O Facebook da loja divulga esse mesmo número como WhatsApp.
  var WHATSAPP = '5531983031214';

  /* --------------------------------------------------------- */

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(s));
  };

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
