# Pedido de casamento — experiência interativa

Uma experiência romântica, pensada primeiro para celular, para enviar como link no WhatsApp. Não há framework, etapa de instalação ou dependência de build: basta abrir `index.html` em um navegador ou publicar os arquivos em uma hospedagem estática.

## Arquivos

```text
pedido-de-casamento/
├── index.html       # Estrutura e metatags de compartilhamento
├── style.css        # Design responsivo e animações
├── script.js        # Configurações e comportamento da experiência
└── assets/          # Suas fotos e imagem de prévia
```

## Personalização rápida

Abra `script.js`. Logo no começo há um único bloco chamado `CONFIGURAÇÕES DO SITE`. Nele você pode mudar:

- nomes de vocês;
- assinatura depois da mensagem;
- foto principal e fotos da galeria;
- todos os textos e botões;
- mensagem que aparece após o “SIM”;
- data de início do relacionamento;
- mensagens e quantidade de fugas do botão “NÃO”;
- paleta de cores.

Não é necessário procurar textos em outros arquivos para personalizar a experiência.

### Fotos

Coloque seus arquivos em `assets/` com os nomes abaixo:

```text
assets/foto-casal.jpg
assets/foto1.jpg
assets/foto2.jpg
assets/foto3.jpg
assets/foto4.jpg
```

Também é possível usar outros nomes; nesse caso, atualize `fotoPrincipal` e `fotosGaleria` no bloco `CONFIG` de `script.js`. Antes de inserir as fotos, o site mostra reservas visuais — nunca ícones de imagem quebrada.

### Data do relacionamento

No `CONFIG`, defina `dataInicio` (por exemplo, `12 de junho de 2021`) e mantenha `mostrarData: true`. Para não mostrar essa frase, use `mostrarData: false`.

## Executar localmente

Abra `index.html` com Chrome, Safari, Edge ou outro navegador moderno. Para simular melhor a publicação e evitar restrições de alguns navegadores, também é possível servir a pasta com qualquer servidor estático — por exemplo, a extensão Live Server no VS Code.

## Publicar e enviar pelo WhatsApp

Hospedagens estáticas simples como GitHub Pages, Netlify ou Cloudflare Pages funcionam bem:

1. Personalize o `CONFIG` e coloque as fotos em `assets/`.
2. Envie toda a pasta `pedido-de-casamento` para a hospedagem escolhida.
3. Acesse a URL publicada no celular e percorra a experiência antes de enviar.
4. Compartilhe essa URL no WhatsApp.

### Prévia bonita no WhatsApp (Open Graph)

Edite as tags no `<head>` de `index.html` antes de publicar:

```html
<meta property="og:title" content="Uma surpresa para você ❤️" />
<meta property="og:description" content="Uma pequena surpresa preparada com muito amor." />
<meta property="og:image" content="https://seu-dominio.com/assets/og-preview.jpg" />
```

Troque os conteúdos pelos seus e substitua `https://seu-dominio.com/...` pela URL final, completa e pública, da imagem. Use uma imagem JPG de pelo menos **1200 × 630 px** em `assets/og-preview.jpg`. Serviços de mensagem guardam a prévia em cache; se ela não atualizar de primeira, aguarde ou envie o link com um parâmetro novo, como `?v=2`.

## Acessibilidade e comportamento

- Os botões têm área confortável para toque e foco visível por teclado.
- A escolha “NÃO” é uma brincadeira apenas nas tentativas definidas. Depois disso, ela para de fugir e pode ser escolhida normalmente.
- As animações são reduzidas automaticamente quando o sistema do dispositivo usa “reduzir movimento”.
- O layout é responsivo, sem rolagem horizontal, e funciona em telas pequenas, desktop, Safari e Chrome modernos.
