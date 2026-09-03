# Ágape Floricultura

Landing page estática em HTML, CSS e JavaScript puro. Sem build, sem dependências:
basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem.

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/ramo.svg         ramo decorativo da faixa rosé
tools/gerar-ornamentos.py   regera o ramo
netlify.toml
```

O ramo é gerado por script, sem editor de vetor:

```
python tools/gerar-ornamentos.py
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

No topo do `assets/js/main.js`. Todos os botões da página abrem o WhatsApp
(`wa.me`) com a mensagem já escrita, incluindo o nome e o preço do item quando o
clique vem de um cartão do catálogo.

O número é o celular do perfil da loja no Google, e a página do Facebook da loja
divulga esse mesmo número como WhatsApp. Ainda assim, vale confirmar.

### 2. As três categorias

A seção "O que temos" tem três categorias fixas no `index.html`: Flores, Plantas
e mudas, e Cestas e presentes. Não há grade de produtos com preço — o pedido é
fechado no WhatsApp, e cada botão já abre a conversa com a mensagem certa.

Se um dia quiser listar itens com preço, o lugar natural é uma nova seção entre
"O que temos" e o Instagram.

### 3. Fotos

As fotos vêm do Pexels e do Unsplash por URL. Para usar fotos da loja, coloque os
arquivos em `assets/img/` e substitua:

| Onde | O que aparece |
|---|---|
| `index.html`, `<link rel="preload">` e `.capa__foto` | foto grande da capa |
| `index.html`, `.coluna figure img` | as três fotos de "O que temos" |
| `index.html`, `.tira img` | as quatro fotos da faixa do Instagram |

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

- **Faixas de cor**: a página é montada em faixas — marfim, rosé e verde se
  alternam. Na seção "O que temos", a faixa verde passa por trás das fotos, que
  ficam metade sobre o marfim e metade sobre o verde. É o corte que dá o ar
  editorial, e não custa imagem nenhuma.
- **Cabeçalho centrado**: marca em cima, menu embaixo. Não é fixo, para a capa
  ganhar a tela inteira logo abaixo.
- **Contraste da capa**: a foto é clara e cheia de pétala rosada. O véu combina
  um radial que escurece o miolo, onde fica a leitura, com um gradiente vertical
  — sem isso o texto branco some sobre as pétalas.
- **Foto da capa em absoluto**: com `height:100%` dentro de um pai de altura
  automática a porcentagem vira `auto`, e a imagem assumiria a altura intrínseca,
  esticando a seção. Fora do fluxo, a altura vem da própria seção.
- **Entrada da capa**: feita com `animation`, não com `transition` disparada por
  classe, para o conteúdo aparecer sozinho mesmo se o JS falhar. O resto da
  página entra por `IntersectionObserver`, com atraso escalonado por grupo de
  irmãos.
- **Lacre giratório**: texto em `textPath` sobre um círculo, girando devagar. É
  o mesmo recurso da referência e não precisa de script.
- **Acessibilidade**: link para pular ao conteúdo, foco visível, menu com foco
  preso enquanto aberto e fechamento no `Esc`, e `prefers-reduced-motion`
  desligando as animações.
