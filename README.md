# Ágape Floricultura

Landing page estática em HTML, CSS e JavaScript puro. Sem build, sem dependências:
basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem.

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/folhagem.svg     divisória botânica entre as seções
assets/img/padrao.svg       padrão sem emenda, textura dos blocos escuros
assets/img/ramo.svg         ramo decorativo do hero e dos serviços
tools/gerar-ornamentos.py   regera os três SVGs acima
netlify.toml
```

Os três ornamentos são gerados por script, sem editor de vetor:

```
python tools/gerar-ornamentos.py
```

Dá para mexer na densidade, no tamanho das folhas e na semente do sorteio
direto no arquivo, e rodar de novo.

Para rodar local com as fontes e o mapa funcionando:

```
python -m http.server 8000
```

## O que trocar para o site ficar completo

### 1. WhatsApp

```js
var WHATSAPP = '5531983031214';
```

No topo do `assets/js/main.js`. Todos os botões da página abrem o WhatsApp
(`wa.me`) com a mensagem já escrita, incluindo o nome e o preço do item quando o
clique vem de um cartão do catálogo.

O número é o celular do perfil da loja no Google, e a página do Facebook da loja
divulga esse mesmo número como WhatsApp. Ainda assim, vale confirmar.

### 2. Itens do catálogo

```js
var ITENS = [
  { nome: 'Buquê de Girassóis', preco: 'R$ 159', marca: 'mais pedido',
    desc: '...', foto: 'px:12272311' },
  ...
];
```

**Os seis nomes, preços e descrições são fictícios**, só para a página ficar de pé.
Troque pelos itens reais. A grade se ajusta sozinha à quantidade.

- `marca` é opcional: deixe `''` para o cartão não exibir selo.
- `pos` é opcional: define o `object-position` daquela foto, para o corte 4:3 não
  cair num pedaço vazio da imagem.
- `foto` aceita dois formatos: `px:123456` para uma foto do Pexels e
  `un:photo-000...` para uma do Unsplash. A função `urlFoto()` monta a URL final.
  Ao migrar para arquivos locais, troque essa função por um caminho direto.

### 3. Fotos

As fotos vêm do Pexels e do Unsplash por URL. Para usar fotos da loja, coloque os
arquivos em `assets/img/` e substitua:

| Onde | O que aparece |
|---|---|
| `index.html`, `<link rel="preload">` e `.hero__foto img` | foto grande do topo |
| `index.html`, `.entrega__capa img` | faixa da seção Entrega |
| `assets/js/main.js`, campo `foto` de cada item | foto de cada item do catálogo |

## Dados reais já publicados na página

Vêm do perfil da loja no Google e estão no HTML e no JSON-LD
(`schema.org/Florist`), que é o que o Google lê para exibir o resultado rico:

- R. José Gomes de Castro, 196 — Santa Cruz, Betim/MG, 32667-350
- (31) 98303-1214
- Segunda a sexta 09:00–19:00 · sábado 09:00–17:00 · domingo 09:00–12:00
- Avaliação 4,9 com 84 avaliações
- Instagram @agape_flores

Os horários aparecem em dois lugares que precisam andar juntos se mudarem: a lista
da seção Contato no `index.html` e o cálculo de "Aberto agora" na função
`horarios()` do `main.js`. Atenção ao domingo: aqui a loja abre, e o cálculo trata
esse caso.

## Detalhes de implementação

- **Emenda entre seções**: uma divisória de folhagem, aplicada como `mask-image`
  e colorida por `background-color` — a mesma imagem serve para qualquer emenda, e
  a variante de cima é a de baixo espelhada com `scaleY(-1)`. Sem suporte a
  máscara vira uma faixa lisa, e o layout não quebra.
- **Textura dos blocos escuros**: o padrão de folhas entra por máscara com
  opacidade baixa, e não por `background-blend-mode` — assim a cor e a intensidade
  são controladas, em vez de depender de como o blend reage ao marrom.
- **Hero em duas colunas**: painel de cor à esquerda e foto à direita. A foto é
  posicionada em absoluto de propósito — com `height:100%` dentro de um pai de
  altura automática, a porcentagem vira `auto` e a imagem assumia a altura
  intrínseca, esticando o hero muito além de 100svh.
- **Medalhão do hero**: a foto redonda fica fora de `.hero__foto`, que tem
  `overflow:hidden` por causa do zoom da imagem e a cortaria. Ela monta sobre a
  emenda para as duas metades se cruzarem, em vez de ficarem lado a lado como dois
  retângulos.
- **Entrada do hero**: feita com `animation`, não com `transition` disparada por
  classe, para o conteúdo aparecer sozinho mesmo se o JS falhar. O resto da página
  entra por `IntersectionObserver`, com atraso escalonado por grupo de irmãos.
- **Bandeiras de pagamento**: marcas simplificadas, desenhadas em SVG inline no
  HTML só para indicar o que a loja aceita. Se quiser os logos oficiais, substitua
  os `<svg>` dentro de `<ul class="bandeiras">`.
- **Acessibilidade**: link para pular ao conteúdo, foco visível, menu com foco
  preso enquanto aberto e fechamento no `Esc`, e `prefers-reduced-motion`
  desligando as animações.
