# -*- coding: utf-8 -*-
"""Gera os ornamentos botânicos do site.

    python tools/gerar-ornamentos.py

Produz três arquivos em assets/img/:

- folhagem.svg        divisória entre seções, com folhas arredondadas e
                      margaridinhas. Usada como mask-image, então é pintada
                      pelo background-color e serve para qualquer cor de seção.
- padrao.svg          padrão sem emenda, de folhas em contorno, para dar
                      textura aos blocos escuros.
- ramo.svg            ramo solto, usado como enfeite no hero e no catálogo.

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


def gerar_folhagem():
    """Divisória: faixa cheia embaixo e folhagem subindo, para encaixar entre
    duas seções de cores diferentes."""
    random.seed(12)
    W, H = 420, 88
    faixa = 70   # faixa baixa: as folhas precisam sobrar acima dela
    partes = ['<rect y="%d" width="%d" height="%d"/>' % (faixa, W, H - faixa)]

    def fileira(x0, passo, comp_rng, giro_max, prop, base):
        x = x0
        while x < W + 24:
            comp = random.uniform(*comp_rng)
            giro = random.uniform(-giro_max, giro_max)
            # o pé da folha afunda na faixa; o resto sobra para fora
            cy = base - math.cos(math.radians(giro)) * comp * 0.5
            partes.append(folha_redonda(x + random.uniform(-4, 4), cy,
                                        comp, comp * prop, giro))
            x += random.uniform(*passo)

    # O vão entre as folhas precisa ser maior que a largura delas, senão a
    # silhueta funde num paredão. Daí folhas estreitas e passo largo.
    fileira(8, (34, 46), (14, 21), 72, .52, faixa + 5)
    fileira(26, (58, 78), (24, 34), 44, .44, faixa + 3)
    fileira(60, (96, 130), (38, 52), 20, .36, faixa + 1)

    # caules com margarida na ponta, mais altos que a folhagem
    x = 40.0
    while x < W:
        alt = random.uniform(50, 70)
        topo = faixa - alt
        partes.append('<rect x="%.1f" y="%.1f" width="1.8" height="%.1f" rx=".9"/>'
                      % (x, topo, alt))
        partes.append(margarida(x + .9, topo - 2, random.uniform(6.5, 9),
                                petalas=5, giro=random.uniform(0, 72)))
        x += random.uniform(86, 122)

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
           'width="%d" height="%d">\n  <g fill="#000">\n    %s\n  </g>\n</svg>\n'
           % (W, H, W, H, '\n    '.join(partes)))
    caminho = os.path.join(SAIDA, 'folhagem.svg')
    open(caminho, 'w', encoding='utf-8').write(svg)
    print('folhagem.svg  %5d bytes  %d formas' % (os.path.getsize(caminho), len(partes)))


def gerar_padrao():
    """Padrão sem emenda: as folhas que cruzam a borda direita são repetidas na
    esquerda (e o mesmo em cima e embaixo), então o ladrilho fecha."""
    random.seed(19)
    T = 240
    partes = []
    for _ in range(9):
        cx, cy = random.uniform(0, T), random.uniform(0, T)
        comp = random.uniform(15, 26)
        giro = random.uniform(0, 360)
        for dx in (-T, 0, T):
            for dy in (-T, 0, T):
                partes.append(folha_redonda(cx + dx, cy + dy, comp, comp * .55, giro))

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
           'width="%d" height="%d">\n'
           '  <g fill="none" stroke="#000" stroke-width="1.5">\n    %s\n  </g>\n</svg>\n'
           % (T, T, T, T, '\n    '.join(partes)))
    caminho = os.path.join(SAIDA, 'padrao.svg')
    open(caminho, 'w', encoding='utf-8').write(svg)
    print('padrao.svg    %5d bytes' % os.path.getsize(caminho))


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
    gerar_folhagem()
    gerar_padrao()
    gerar_ramo()
