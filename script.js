"use strict";

// ================================================================
// CONFIGURAÇÕES DO SITE
// Edite somente este bloco para deixar a surpresa com a cara de vocês.
// Caminhos de foto são relativos ao arquivo index.html.
// ================================================================
const CONFIG = {
  // Nomes usados em pequenos detalhes da experiência.
  nomeDela: "Meu Amor",
  meuNome: "Kaique",
  mostrarAssinatura: true,

  // Foto de abertura. Substitua o arquivo em /assets mantendo o nome,
  // ou troque o caminho abaixo por outro arquivo da sua preferência.
  fotoPrincipal: "assets/foto-casal.jpg",
  textoAlternativoFotoPrincipal: "Foto especial do casal",

  // A música começa no clique em "Fazer pedido".
  musicaDeFundo: {
    arquivo: "assets/Coldplay - The Scientist.mp3",
    volume: 0.42,
  },

  // Galeria exibida depois do SIM. Pode adicionar/remover fotos da lista.
  fotosGaleria: [
    { arquivo: "assets/foto1.jpg", descricao: "Primeiro de muitos❤️" },
    { arquivo: "assets/foto2.jpg", descricao: "Um presente quase que perfeito." },
    { arquivo: "assets/foto3.jpg", descricao: "Um menino bagunceiro e... \numa gata 😏" },
    { arquivo: "assets/foto4.jpg", descricao: "A mais gata de todas 😏" },
    { arquivo: "assets/foto5.jpg", descricao: "Um lindo dia de Natal." },
    { arquivo: "assets/foto6.jpg", descricao: "Um casamento por aí sabe hihihi." },
    { arquivo: "assets/foto7.jpg", descricao: "Nesse dia a gente tava bunitão heeein😏" },
    { arquivo: "assets/foto8.jpg", descricao: "Agora sim o presente perfeito ❤️\nTe amo meu amor ❤️" },
  ],

  // Textos principais e botões. Você pode escrever do seu jeito.
  textos: {
    dedicacao: "PARA VOCÊ, MEU AMOR ❤️",
    abertura: "Eu preparei uma coisa especial...",
    botaoContinuar: "Continuar ❤️",
    preparacao: "Tenho uma coisa muito importante para te perguntar...",
    complementoPreparacao: "Mas antes... preciso que você crie coragem. 😳❤️",
    botaoPronta: "Estou pronta 👀",
    introducaoPergunta: "Então preciso saber uma coisa...",
    pergunta: "Você se casaria comigo? 💍❤️",
    botaoSim: "SIM 💍❤️",
    botaoNao: "NÃO 😳",
    tituloSim: "EU SABIA! ❤️",
    introducaoSim: "Espero passar o resto da minha vida aumentando esse contador com você. ❤️\n\nE agora temos um novo capítulo para escrever juntos. ❤️",
    tituloGaleria: "Alguns dos meus momentos favoritos com você... ❤️",
    fimGaleria: "E ainda temos muitos pela frente.",
    encerramento: "Nosso próximo capítulo começa agora. 💍❤️",
    declaracaoFinal: "Te amo ❤️",
  },

  // Mensagem longa mostrada após o SIM. Quebras de linha são preservadas.
  mensagemPersonalizada: `Desde que você entrou na minha vida, tudo ficou mais bonito e mais divertido.

E eu quero continuar vivendo, sorrindo, sonhando e construindo nossa história ao seu lado.

Que esse seja apenas o começo de muita coisa que ainda vamos escrever juntos. ❤️`,

  // Data do relacionamento: defina mostrarData como false para ocultar a frase.
  mostrarData: true,
  dataInicio: "[DATA]",
  textoData: "Desde [DATA], estamos escrevendo essa história juntos. ❤️",

  // O NÃO brinca algumas vezes e depois fica disponível como escolha de verdade.
  tentativasAntesDoNaoParar: 8,
  mensagensDoNao: [
    "Tem certeza? 🥺",
    "Pensa com carinho... ❤️",
    "Olha o botão SIM ali 👀",
    "Você realmente quer dizer não? 😭",
    "Vou perguntar de novo... 😳",
    "Calma, pensa mais um pouquinho 😂❤️",
  ],

  // Cores da paleta. Alterar estes valores muda o visual inteiro.
  cores: {
    vinho: "#4b1729",
    vinhoEscuro: "#260d18",
    vermelho: "#9d2745",
    rosa: "#eab9c2",
    creme: "#fffaf7",
    dourado: "#d7a95a",
  },

  // Estes dados atualizam o título da aba. Para WhatsApp, atualize também
  // as tags og:title, og:description e og:image no <head> do index.html.
  meta: {
    tituloPagina: "Uma surpresa para você ❤️",
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const views = [...document.querySelectorAll(".view")];
let questionTimer;
let questionSequence = 0;
let introSequenceTimers = [];
let noAttempts = 0;
let photoPreviewTrigger;
let relationshipCounterInterval;
let answerSequenceTimers = [];
let screenShakeAnimation;

// Garante que a pergunta seja medida com a fonte final, evitando uma quebra
// de linha temporária com a fonte de fallback.
const questionFontReady = document.fonts?.load
  ? document.fonts.load('500 2.45rem "Playfair Display"').catch(() => [])
  : Promise.resolve();

const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function applyConfiguration() {
  const text = CONFIG.textos;
  document.title = CONFIG.meta.tituloPagina;

  // Cores centralizadas: mapeadas para variáveis CSS usadas pelo layout.
  const root = document.documentElement.style;
  root.setProperty("--wine", CONFIG.cores.vinho);
  root.setProperty("--wine-deep", CONFIG.cores.vinhoEscuro);
  root.setProperty("--red", CONFIG.cores.vermelho);
  root.setProperty("--rose", CONFIG.cores.rosa);
  root.setProperty("--cream", CONFIG.cores.creme);
  root.setProperty("--gold", CONFIG.cores.dourado);

  setText("#dedication", text.dedicacao);
  setText("#photo-title", text.abertura);
  setText("#continue-button", text.botaoContinuar);
  setText("#build-up-title", text.preparacao);
  setText(".supporting-text", text.complementoPreparacao);
  setText("#ready-button", text.botaoPronta);
  setText("#question-intro", text.introducaoPergunta);
  setText("#yes-button", text.botaoSim);
  setText("#no-button", text.botaoNao);
  setText("#yes-title", text.tituloSim);
  setText(".chapter-intro", text.introducaoSim);
  setText("#gallery-title", text.tituloGaleria);
  setText(".gallery-ending", text.fimGaleria);
  setText(".final-line", text.encerramento);
  setText("#final-love", text.declaracaoFinal);

  const heroPhoto = $("#hero-photo");
  heroPhoto.alt = CONFIG.textoAlternativoFotoPrincipal;
  heroPhoto.addEventListener("load", () => $("#hero-photo-wrap").classList.remove("is-placeholder"));
  heroPhoto.addEventListener("error", () => $("#hero-photo-wrap").classList.add("is-placeholder"));
  heroPhoto.src = CONFIG.fotoPrincipal;
  if (heroPhoto.complete && heroPhoto.naturalWidth === 0) {
    $("#hero-photo-wrap").classList.add("is-placeholder");
  }

  const backgroundMusic = $("#background-music");
  backgroundMusic.src = CONFIG.musicaDeFundo.arquivo;
  backgroundMusic.volume = Math.max(0, Math.min(1, CONFIG.musicaDeFundo.volume));

  $("#love-letter").textContent = CONFIG.mensagemPersonalizada;
  const signature = $("#signature");
  signature.hidden = !CONFIG.mostrarAssinatura || !CONFIG.meuNome.trim();
  signature.textContent = CONFIG.mostrarAssinatura ? `Com todo o meu amor e agora seu noivo,\n${CONFIG.meuNome} ❤️` : "";
  const dateLine = $("#relationship-date");
  if (CONFIG.mostrarData && CONFIG.dataInicio.trim() && CONFIG.dataInicio !== "[DATA]") {
    dateLine.hidden = false;
    dateLine.textContent = CONFIG.textoData.replace("[DATA]", CONFIG.dataInicio);
  } else {
    dateLine.hidden = true;
  }

  buildGallery();
}

function buildGallery() {
  const gallery = $("#gallery");
  gallery.replaceChildren();

  CONFIG.fotosGaleria.forEach((photo, index) => {
    const card = document.createElement("figure");
    const image = document.createElement("img");
    const fallback = document.createElement("span");
    const isSpoiler = photo.arquivo.endsWith("foto8.jpg");

    card.className = `gallery-card${isSpoiler ? " gallery-card--spoiler" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", isSpoiler ? "Spoiler. Toque para descobrir a última foto." : `Ampliar: ${photo.descricao}`);
    card.style.animationDelay = `${180 + index * 120}ms`;
    image.src = photo.arquivo;
    image.alt = isSpoiler ? "Imagem marcada como spoiler" : photo.descricao;
    image.loading = "lazy";
    fallback.className = "gallery-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.textContent = "♡";

    if (isSpoiler) {
      const spoilerCover = document.createElement("span");
      spoilerCover.className = "gallery-spoiler-cover";
      spoilerCover.setAttribute("aria-hidden", "true");
      spoilerCover.innerHTML = '<strong>SPOILER</strong>';
      card.append(image, fallback, spoilerCover);
    } else {
      card.append(image, fallback);
    }

    image.addEventListener("error", () => card.classList.add("is-placeholder"));
    image.addEventListener("load", () => card.classList.remove("is-placeholder"));
    if (image.complete && image.naturalWidth === 0) card.classList.add("is-placeholder");
    card.addEventListener("click", () => openPhotoPreview(image, card, photo.descricao));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPhotoPreview(image, card, photo.descricao);
      }
    });
    gallery.append(card);
  });
}

function openPhotoPreview(image, trigger, caption = image?.alt || "") {
  // Nao abre o quadro de placeholder caso a imagem nao tenha carregado.
  if (!image || image.naturalWidth === 0) return;

  const preview = $("#photo-preview");
  const previewImage = $("#photo-preview-image");
  const previewCaption = $("#photo-preview-caption");
  photoPreviewTrigger = trigger;
  previewImage.src = image.currentSrc || image.src;
  previewImage.alt = caption;
  previewCaption.textContent = caption;
  preview.classList.toggle("is-zooming-foto8", image.src.endsWith("/foto8.jpg"));
  preview.hidden = false;
  document.body.classList.add("has-photo-preview");
  $("#photo-preview-close").focus();
}

function closePhotoPreview() {
  const preview = $("#photo-preview");
  if (preview.hidden) return;

  preview.hidden = true;
  preview.classList.remove("is-zooming-foto8");
  $("#photo-preview-image").removeAttribute("src");
  $("#photo-preview-caption").textContent = "";
  document.body.classList.remove("has-photo-preview");
  photoPreviewTrigger?.focus();
  photoPreviewTrigger = undefined;
}

function createBackgroundHearts() {
  if (reducedMotion) return;

  const field = $("#heart-field");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 13; i += 1) {
    const heart = document.createElement("span");
    heart.className = "background-heart";
    heart.textContent = i % 3 === 0 ? "✦" : "♥";
    heart.style.setProperty("--size", `${0.55 + Math.random() * 0.85}rem`);
    heart.style.left = `${4 + Math.random() * 92}%`;
    heart.style.setProperty("--duration", `${10 + Math.random() * 11}s`);
    heart.style.setProperty("--delay", `${-Math.random() * 15}s`);
    fragment.append(heart);
  }
  field.append(fragment);
}

function showView(nextId, options = {}) {
  const next = document.getElementById(nextId);
  const current = views.find((view) => view.classList.contains("is-active"));
  window.clearTimeout(questionTimer);
  questionSequence += 1;

  const revealNext = () => {
    views.forEach((view) => {
      const shouldShow = view === next;
      view.hidden = !shouldShow;
      view.classList.remove("is-active", "is-leaving");
    });
    next.hidden = false;
    // Cada nova tela começa no topo, inclusive em celulares com rolagem longa.
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Reflow reinicia a animação ao voltar a uma tela.
    void next.offsetWidth;
    next.classList.add("is-active");
    if (typeof options.afterShow === "function") options.afterShow();
  };

  if (current && current !== next && !reducedMotion) {
    current.classList.remove("is-active");
    current.classList.add("is-leaving");
    window.setTimeout(revealNext, 260);
  } else {
    revealNext();
  }
}

function startIntroSequence() {
  const moments = ["hero-photo-wrap", "photo-title", "continue-button"];
  const stepDelay = reducedMotion ? 700 : 2200;

  introSequenceTimers.forEach(window.clearTimeout);
  introSequenceTimers = moments.map((id, index) => window.setTimeout(() => {
    const next = document.getElementById(id);
    next.hidden = false;
    void next.offsetWidth;
    next.classList.add("is-visible");
  }, stepDelay * (index + 1)));
}

function openQuestion() {
  showView("view-question", {
    afterShow: () => {
      const question = $("#question-title");
      const sequence = questionSequence;
      question.textContent = "";
      question.classList.remove("is-revealed");
      const wait = reducedMotion ? 0 : 850;
      questionTimer = window.setTimeout(() => {
        questionFontReady.then(() => {
          if (sequence !== questionSequence) return;
          question.textContent = CONFIG.textos.pergunta;
          question.classList.add("is-revealed");
        });
      }, wait);
    },
  });
}

function resetNoButton() {
  const noButton = $("#no-button");
  noAttempts = 0;
  noButton.classList.remove("is-escaping");
  noButton.style.removeProperty("left");
  noButton.style.removeProperty("top");
  $("#no-hint").textContent = "";
}

function moveNoButton() {
  const noButton = $("#no-button");
  const stage = $("#choice-stage");
  const maxAttempts = Math.max(0, CONFIG.tentativasAntesDoNaoParar);

  // Após as tentativas configuradas, a resposta NÃO segue sendo possível.
  if (noAttempts >= maxAttempts) {
    showView("view-no");
    return;
  }

  noAttempts += 1;
  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;
  const horizontalRoom = Math.max(0, stage.clientWidth - buttonWidth);
  const verticalRoom = Math.max(0, stage.clientHeight - buttonHeight - 24);
  const stageBounds = stage.getBoundingClientRect();
  const buttonBounds = noButton.getBoundingClientRect();
  const currentLeft = Math.min(horizontalRoom, Math.max(0, buttonBounds.left - stageBounds.left));
  const currentTop = Math.min(verticalRoom, Math.max(0, buttonBounds.top - stageBounds.top));
  const maximumDistance = Math.hypot(horizontalRoom, verticalRoom);
  // A distância mínima cresce a cada tentativa. Caso a tela não tenha espaço
  // suficiente, a posição mais distante possível é escolhida.
  const minimumDistance = maximumDistance * Math.min(0.94, 0.3 + noAttempts * 0.08);
  const positions = [
    [0, 0],
    [horizontalRoom, 0],
    [0, verticalRoom],
    [horizontalRoom, verticalRoom],
  ];

  for (let i = 0; i < 36; i += 1) {
    positions.push([Math.random() * horizontalRoom, Math.random() * verticalRoom]);
  }

  const candidates = positions.map(([left, top]) => ({
    left,
    top,
    distance: Math.hypot(left - currentLeft, top - currentTop),
  }));
  const farEnough = candidates
    .filter((candidate) => candidate.distance >= minimumDistance)
    .sort((a, b) => a.distance - b.distance);
  const options = farEnough.length ? farEnough.slice(0, 5) : candidates.sort((a, b) => b.distance - a.distance).slice(0, 1);
  const destination = options[Math.floor(Math.random() * options.length)];

  noButton.classList.add("is-escaping");
  noButton.style.left = `${Math.round(destination.left)}px`;
  noButton.style.top = `${Math.round(destination.top)}px`;
  const messages = CONFIG.mensagensDoNao;
  $("#no-hint").textContent = messages[(noAttempts - 1) % messages.length] || "";
}

function createCelebration() {
  if (reducedMotion) return;

  const layer = $("#celebration-layer");
  layer.replaceChildren();
  const colors = ["#fff1d3", "#eeb4c0", "#d7a95a", "#f7d5dc", "#b7425f"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 82; i += 1) {
    const piece = document.createElement("span");
    const isHeart = i % 5 === 0;
    const size = isHeart ? 1 + Math.random() * 1.1 : 0.35 + Math.random() * 0.45;
    piece.className = `celebration-piece${isHeart ? " is-heart" : ""}`;
    if (isHeart) piece.textContent = i % 2 === 0 ? "♥" : "✦";
    piece.style.setProperty("--left", `${Math.random() * 100}%`);
    piece.style.setProperty("--width", `${size}rem`);
    piece.style.setProperty("--height", `${size * 0.58}rem`);
    piece.style.setProperty("--radius", isHeart ? "0" : "0.15rem");
    piece.style.setProperty("--color", colors[i % colors.length]);
    piece.style.setProperty("--drift", `${-18 + Math.random() * 36}vw`);
    piece.style.setProperty("--spin", `${-360 + Math.random() * 720}deg`);
    piece.style.setProperty("--fall-duration", `${2.2 + Math.random() * 1.8}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.55}s`);
    fragment.append(piece);
  }
  layer.append(fragment);
}

function sayYes() {
  shakeScreen();

  showView("view-yes", {
    afterShow: () => {
      resetGalleryAnimation();
      startAnswerSequence();
    },
  });
}

function shakeScreen() {
  const experience = $("#experience");
  screenShakeAnimation?.cancel();
  const distance = reducedMotion ? 4 : 12;
  const angle = reducedMotion ? 0.15 : 0.45;
  screenShakeAnimation = experience.animate([
    { transform: "translate3d(0, 0, 0) rotate(0)" },
    { transform: `translate3d(${-distance}px, 3px, 0) rotate(-${angle}deg)` },
    { transform: `translate3d(${distance}px, -3px, 0) rotate(${angle}deg)` },
    { transform: `translate3d(${-distance}px, 2px, 0) rotate(-${angle}deg)` },
    { transform: `translate3d(${distance}px, -2px, 0) rotate(${angle}deg)` },
    { transform: `translate3d(${-distance * 0.8}px, 2px, 0) rotate(-${angle * 0.8}deg)` },
    { transform: `translate3d(${distance * 0.65}px, -2px, 0) rotate(${angle * 0.65}deg)` },
    { transform: `translate3d(${-distance * 0.4}px, 1px, 0) rotate(-${angle * 0.4}deg)` },
    { transform: `translate3d(${distance * 0.2}px, -1px, 0) rotate(${angle * 0.2}deg)` },
    { transform: "translate3d(0, 0, 0) rotate(0)" },
  ], {
    duration: 1500,
    easing: "linear",
    iterations: 1,
  });
}

function startAnswerSequence() {
  const answerView = $("#view-yes");
  const opening = $("#answer-opening");
  const letterIntro = $("#letter-intro");
  const letterStage = $("#letter-stage");
  const galleryStage = $("#gallery-stage");
  const endingLine = $(".final-line");
  const finalLove = $("#final-love");
  const seal = $(".yes-seal");
  const delays = reducedMotion
    ? { opening: 150, confetti: 950, letterIntro: 1700, letter: 2600, gallery: 3900, ending: 4700 }
    : { opening: 1100, confetti: 2600, letterIntro: 7100, letter: 8500, gallery: 11_000, ending: 12_200 };

  answerSequenceTimers.forEach(window.clearTimeout);
  answerSequenceTimers = [];
  answerView.classList.add("is-staging");
  [opening, letterIntro, letterStage, galleryStage, endingLine, finalLove].forEach((stage) => {
    stage.classList.remove("is-visible");
  });
  seal.classList.remove("is-visible");
  void answerView.offsetWidth;
  seal.classList.add("is-visible");

  const schedule = (delay, callback) => {
    answerSequenceTimers.push(window.setTimeout(callback, delay));
  };
  schedule(delays.opening, () => {
    opening.classList.add("is-visible");
    startRelationshipCounter();
  });
  schedule(delays.confetti, createCelebration);
  schedule(delays.letterIntro, () => letterIntro.classList.add("is-visible"));
  schedule(delays.letter, () => letterStage.classList.add("is-visible"));
  schedule(delays.gallery, () => galleryStage.classList.add("is-visible"));
  schedule(delays.ending, () => {
    endingLine.classList.add("is-visible");
    finalLove.classList.add("is-visible");
  });
}

function addCalendarMonths(date, months) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

function startRelationshipCounter() {
  const counter = $("#relationship-counter");
  const start = new Date(2022, 11, 30, 19, 0, 0);

  const update = () => {
    const now = new Date();
    if (now < start) {
      counter.textContent = "Juntos há 0 anos, 0 meses, 0 dias, 0 horas e 0 minutos.";
      return;
    }

    let cursor = new Date(start);
    let years = now.getFullYear() - cursor.getFullYear();
    let next = new Date(cursor);
    next.setDate(1);
    next.setFullYear(next.getFullYear() + years);
    const lastDayOfTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(cursor.getDate(), lastDayOfTargetMonth));
    if (next > now) years -= 1;
    cursor = new Date(start);
    cursor.setDate(1);
    cursor.setFullYear(cursor.getFullYear() + years);
    cursor.setDate(Math.min(start.getDate(), new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()));

    let months = 0;
    while (months < 11 && addCalendarMonths(cursor, 1) <= now) {
      cursor = addCalendarMonths(cursor, 1);
      months += 1;
    }

    let remaining = now - cursor;
    const days = Math.floor(remaining / 86_400_000);
    remaining %= 86_400_000;
    const hours = Math.floor(remaining / 3_600_000);
    remaining %= 3_600_000;
    const minutes = Math.floor(remaining / 60_000);
    counter.textContent = `Juntos há ${years} ${years === 1 ? "ano" : "anos"}, ${months} ${months === 1 ? "mês" : "meses"}, ${days} ${days === 1 ? "dia" : "dias"}, ${hours} ${hours === 1 ? "hora" : "horas"} e ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`;
  };

  window.clearInterval(relationshipCounterInterval);
  update();
  relationshipCounterInterval = window.setInterval(update, 60_000);
}

function playBackgroundMusic() {
  const backgroundMusic = $("#background-music");
  if (!backgroundMusic) return;

  backgroundMusic.play().then(updateMusicToggle).catch(() => {
    // A experiência continua normalmente se o navegador não puder tocar o áudio.
    updateMusicToggle();
  });
}

function updateMusicToggle() {
  const backgroundMusic = $("#background-music");
  const button = $("#music-toggle");
  const isPlaying = !backgroundMusic.paused && !backgroundMusic.ended;
  button.setAttribute("aria-pressed", String(isPlaying));
  button.setAttribute("aria-label", isPlaying ? "Desligar música" : "Ligar música");
}

function toggleBackgroundMusic() {
  const backgroundMusic = $("#background-music");
  if (backgroundMusic.paused) {
    backgroundMusic.play().then(updateMusicToggle).catch(updateMusicToggle);
  } else {
    backgroundMusic.pause();
    updateMusicToggle();
  }
}

function resetGalleryAnimation() {
  document.querySelectorAll(".gallery-card").forEach((card, index) => {
    card.style.animation = "none";
    void card.offsetWidth;
    card.style.removeProperty("animation");
    card.style.animationDelay = `${180 + index * 120}ms`;
  });
}

function bindEvents() {
  const backgroundMusic = $("#background-music");
  backgroundMusic.addEventListener("play", updateMusicToggle);
  backgroundMusic.addEventListener("pause", updateMusicToggle);
  $("#music-toggle").addEventListener("click", toggleBackgroundMusic);
  updateMusicToggle();

  $("#order-button").addEventListener("click", () => {
    playBackgroundMusic();
    showView("view-photo", { afterShow: startIntroSequence });
  });
  $("#continue-button").addEventListener("click", () => showView("view-build-up"));
  $("#ready-button").addEventListener("click", openQuestion);
  $("#yes-button").addEventListener("click", sayYes);
  $("#no-button").addEventListener("click", moveNoButton);
  $("#back-button").addEventListener("click", () => {
    resetNoButton();
    openQuestion();
  });

  $("#photo-preview-close").addEventListener("click", closePhotoPreview);
  $("#photo-preview").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closePhotoPreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePhotoPreview();
  });
}

applyConfiguration();
createBackgroundHearts();
bindEvents();
