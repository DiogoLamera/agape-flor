# Ágape Floricultura

Landing page estática em HTML, CSS e JavaScript puro. Sem build, sem dependências:
basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem.

```
index.html
assets/css/style.css
assets/js/main.js
netlify.toml
```

Para rodar local com as fontes e o mapa funcionando:

```
python -m http.server 8000
```

## O que trocar para o site ficar completo

### 1. WhatsApp

```js
var WHATSAPP = '5531983031214';
```

No topo do `assets/js/main.js`. Todos os botões e links de pedido da página
abrem o WhatsApp (`wa.me`) com a mensagem já escrita, incluindo o nome do buquê
quando o clique vem da vitrine.

O número é o celular do perfil da loja no Google, e a página do Facebook da loja
divulga esse mesmo número como WhatsApp. Ainda assim, vale confirmar.

### 2. Os buquês da vitrine

```js
var BUQUES = [
  { nome: 'Girassol', tipo: 'Buquê pronto', foto: '12272311', texto: '...' },
  ...
];
```

**Os cinco nomes e descrições são fictícios**, só para a página ficar de pé.
Troque pelos arranjos reais. A fita de nomes e a ficha se ajustam sozinhas à
quantidade de itens.

- `nome` aparece na fita em corpo enorme, então cabe **uma palavra só**.
- `tipo` é a etiqueta pequena acima do nome.
- `foto` é o identificador da imagem no Pexels. Ao migrar para arquivos locais,
  troque a função `urlFoto()` por um caminho direto.

### 3. Fotos

As fotos vêm do Pexels por URL. Para usar fotos da loja, coloque os arquivos em
`assets/img/` e substitua:

| Onde | O que aparece |
|---|---|
| `index.html`, `<link rel="preload">` e `.capa__foto img` | foto grande da capa |
| `index.html`, `.alma__foto img` | foto da seção "Amor em flor" |
| `assets/js/main.js`, campo `foto` de cada buquê | foto da vitrine |

## Dados reais já publicados na página

Vêm do perfil da loja no Google e estão no HTML e no JSON-LD
(`schema.org/Florist`), que é o que o Google lê para exibir o resultado rico:

- R. José Gomes de Castro, 196 — Santa Cruz, Betim/MG, 32667-350
- (31) 98303-1214
- Segunda a sexta 09:00–19:00 · sábado 09:00–17:00 · domingo 09:00–12:00
- Avaliação 4,9 com 84 avaliações
- Instagram @agape_flores

Os horários aparecem em dois lugares que precisam andar juntos se mudarem: a
lista da seção Contato no `index.html` e o cálculo de "Aberto agora" na função
`horarios()` do `main.js`. Atenção ao domingo: aqui a loja abre, e o cálculo
trata esse caso.

## Detalhes de implementação

- **Capa dentro da primeira tela**: a barra flutua por cima da capa em vez de
  empurrá-la, a capa vale `100svh` e a foto usa `flex:1 1 0`, então ela fica com
  exatamente a altura que sobra depois do título. A imagem é posicionada em
  absoluto: com `height:100%` dentro de um pai de altura automática a
  porcentagem vira `auto`, e ela assumia a altura intrínseca — 1800px, quatro
  vezes o espaço disponível.
- **Tipografia como imagem**: a marca na capa ocupa quase a largura inteira
  (`font-size` em `vw`, `letter-spacing` negativo). O `min()` com `vh` segura o
  corpo em janela baixa, senão a capa não cabe na primeira tela. Como o
  `line-height` é menor que 1 e a seção tem `overflow:hidden`, o acento do "Á"
  era cortado — daí o `padding-top` em `em` no título.
- **Marca**: flor de cinco pétalas desenhada em SVG inline, junto do nome. Fica
  inline no HTML de propósito, para herdar o `currentColor` da barra e do rodapé.
  O favicon repete o mesmo desenho.
- **Fita de nomes**: a lista dos buquês é montada três vezes seguidas, e o item
  ativo é sempre o da cópia do meio. Assim há sempre nome à esquerda e à direita,
  e a fita parece não ter começo nem fim. O trilho desliza por `transform`, com a
  conta do centro refeita quando a fonte carrega e quando a janela muda.
- **Troca de foto da vitrine**: a imagem nova é carregada em memória antes de
  entrar, para a troca não piscar.
- **Animação da capa**: a palavra sobe por trás de uma máscara (`overflow:hidden`
  no `h1`, `translateY` no `span` de dentro), a foto abre de baixo para cima com
  `clip-path`, e a etiqueta lateral e a pista de rolagem entram depois. Tudo com
  `animation`, e não com `transition` disparada por classe, para o conteúdo
  aparecer sozinho mesmo se o JS falhar. A foto ainda tem um zoom lento contínuo.
- **Parallax da capa**: no scroll, a foto anda mais devagar que a página e o
  título anda um pouco contra, então as duas camadas se aproximam em vez de
  subirem como um bloco só. Um `requestAnimationFrame` por quadro, desligado em
  `prefers-reduced-motion`. O zoom fica na `<img>` e o parallax no wrapper, para
  os dois não disputarem o mesmo `transform`.
- **Etiqueta lateral**: usa `writing-mode:vertical-rl`, e não `rotate`. O texto
  girado por `transform` saía da caixa e era cortado pelo `overflow:hidden` da
  capa.
- **Sem JavaScript o texto continua visível**: os estados iniciais das animações
  de scroll (`[data-revela]`, `[data-sobe]`) são escritos sob `.js`, e essa classe
  é posta no `<html>` por um script inline no `head`. Se o script não rodar, nada
  fica escondido. Sem isso um título com máscara ficaria invisível para sempre.
- **Capa no celular**: abaixo de 900px a capa deixa de valer `100svh` e a foto
  ganha proporção 4/5 com teto em `vh`. Esticada até o pé de uma tela estreita
  ela virava um retrato altíssimo e cortava quase toda a imagem.
- **Acessibilidade**: link para pular ao conteúdo, foco visível, menu com foco
  preso enquanto aberto e fechamento no `Esc`, setas do teclado na fita, aviso em
  `aria-live` a cada troca de buquê, e `prefers-reduced-motion` desligando as
  animações.
