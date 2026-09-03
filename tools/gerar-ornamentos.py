# -*- coding: utf-8 -*-
"""Gera os ornamentos botânicos do site.

    python tools/gerar-ornamentos.py

Produz assets/img/ramo.svg: um ramo solto, usado como máscara para o enfeite
da faixa rosé. Como é máscara, a cor vem do CSS.

Sem dependências: só a biblioteca padrão.
"""
import math
import os
import random

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(AQUI, 'assets', 'img')


def folha_redonda(cx, cy, comp, larg, giro):
    """Folha larga de ponta arredondada — perfil de planta de vaso, e não
    a folha lanceolada e pontuda de buquê."""
    d = ('M0 {a:.1f} C{l:.1f} {b:.1f} {l:.1f} {c:.1f} 0 {e:.1f} '
         'C{m:.1f} {c:.1f} {m:.1f} {b:.1f} 0 {a:.1f} Z').format(
        a=-comp, b=-comp * 0.72, c=comp * 0.58, e=comp * 0.82,
        l=larg, m=-larg)
    return ('<path d="%s" transform="translate(%.1f %.1f) rotate(%.1f)"/>'
            % (d, cx, cy, giro))


def margarida(cx, cy, raio, petalas=6, giro=0.0):
    p = ['<g transform="translate(%.1f %.1f) rotate(%.1f)">' % (cx, cy, giro)]
    for i in range(petalas):
        a = i * (360.0 / petalas)
        p.append('<ellipse cx="0" cy="%.1f" rx="%.1f" ry="%.1f" transform="rotate(%.1f)"/>'
                 % (-raio * .62, raio * .30, raio * .52, a))
    p.append('<circle r="%.1f"/></g>' % (raio * .3))
    return ''.join(p)


def gerar_ramo():
    """Ramo solto para enfeitar cantos, com folhas alternadas no caule."""
    W, H = 200, 320
    partes = ['<path d="M100 320 C86 240 96 150 118 60" fill="none" '
              'stroke="#000" stroke-width="3.4" stroke-linecap="round"/>']
    for i in range(9):
        t = i / 8.0
        x = 100 - 14 * math.sin(t * 2.6) + 18 * t
        y = 320 - t * 262
        lado = 1 if i % 2 == 0 else -1
        comp = 34 - 14 * t
        partes.append(folha_redonda(x + lado * comp * .55, y - comp * .2,
                                    comp, comp * .58, 74 * lado + 12 * t))
    partes.append(margarida(122, 52, 13, giro=18))

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
           'width="%d" height="%d">\n  <g fill="#000">\n    %s\n  </g>\n</svg>\n'
           % (W, H, W, H, '\n    '.join(partes)))
    caminho = os.path.join(SAIDA, 'ramo.svg')
    open(caminho, 'w', encoding='utf-8').write(svg)
    print('ramo.svg      %5d bytes' % os.path.getsize(caminho))


if __name__ == '__main__':
    gerar_ramo()
