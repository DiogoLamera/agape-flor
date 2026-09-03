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

- **Tipografia como imagem**: a marca na capa ocupa quase a largura inteira
  (`font-size` em `vw`, `letter-spacing` negativo). Como o `line-height` é menor
  que 1 e a seção tem `overflow:hidden`, o acento do "Á" era cortado — daí o
  `padding-top` em `em` no título.
- **Fita de nomes**: a lista dos buquês é montada três vezes seguidas, e o item
  ativo é sempre o da cópia do meio. Assim há sempre nome à esquerda e à direita,
  e a fita parece não ter começo nem fim. O trilho desliza por `transform`, com a
  conta do centro refeita quando a fonte carrega e quando a janela muda.
- **Troca de foto da vitrine**: a imagem nova é carregada em memória antes de
  entrar, para a troca não piscar.
- **Entrada da capa**: feita com `animation`, não com `transition` disparada por
  classe, para o conteúdo aparecer sozinho mesmo se o JS falhar.
- **Acessibilidade**: link para pular ao conteúdo, foco visível, menu com foco
  preso enquanto aberto e fechamento no `Esc`, setas do teclado na fita, aviso em
  `aria-live` a cada troca de buquê, e `prefers-reduced-motion` desligando as
  animações.
