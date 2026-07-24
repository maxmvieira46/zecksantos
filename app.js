const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const body = document.body;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const preloader = $('#preloader');
window.addEventListener('load', () => {
  window.setTimeout(() => preloader?.classList.add('hidden'), 700);
});

const header = $('#site-header');
const progress = $('#page-progress');
const navLinks = $$('.main-nav a');
const menuToggle = $('#menu-toggle');

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const sections = $$('main section[id]');
function updatePageState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  if (progress) progress.style.height = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  header?.classList.toggle('scrolled', window.scrollY > 30);

  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updatePageState, { passive: true });
updatePageState();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
$$('.reveal').forEach(element => revealObserver.observe(element));

const heroTilt = $('#hero-tilt');
if (heroTilt && canHover) {
  heroTilt.addEventListener('pointermove', event => {
    const box = heroTilt.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    heroTilt.style.setProperty('--ry', `${x * 7}deg`);
    heroTilt.style.setProperty('--rx', `${y * -7}deg`);
  });
  heroTilt.addEventListener('pointerleave', () => {
    heroTilt.style.setProperty('--ry', '0deg');
    heroTilt.style.setProperty('--rx', '0deg');
  });
}

/* Hero, carrossel automático de 3 segundos */
const heroVisual = $('.hero-visual');
const heroLookImage = $('#hero-look-image');
const heroLookNumber = $('#hero-look-number');
const heroLookTitle = $('#hero-look-title');
const heroLookDescription = $('#hero-look-description');
const heroLookButtons = $$('.hero-look-button');
const heroCarouselProgress = $('.hero-carousel-progress');
let heroIndex = Math.max(0, heroLookButtons.findIndex(button => button.classList.contains('active')));
let heroTimer = null;
let heroCarouselVisible = true;
let heroCarouselPaused = false;

function restartHeroProgress() {
  if (!heroCarouselProgress || prefersReducedMotion || heroCarouselPaused || !heroCarouselVisible) return;
  heroCarouselProgress.classList.remove('is-running');
  void heroCarouselProgress.offsetWidth;
  heroCarouselProgress.classList.add('is-running');
}

function setHeroLook(index, shouldSchedule = true) {
  if (!heroLookImage || !heroLookButtons.length) return;
  heroIndex = (index + heroLookButtons.length) % heroLookButtons.length;
  const button = heroLookButtons[heroIndex];

  heroLookButtons.forEach((item, itemIndex) => {
    const active = itemIndex === heroIndex;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  heroLookImage.classList.add('is-switching');
  window.setTimeout(() => {
    heroLookImage.src = button.dataset.image;
    heroLookImage.alt = button.dataset.alt;
    if (heroLookNumber) heroLookNumber.textContent = button.dataset.number;
    if (heroLookTitle) heroLookTitle.textContent = button.dataset.title;
    if (heroLookDescription) heroLookDescription.textContent = button.dataset.description;
    const finish = () => heroLookImage.classList.remove('is-switching');
    heroLookImage.addEventListener('load', finish, { once: true });
    if (heroLookImage.complete) finish();
  }, 170);

  if (shouldSchedule) scheduleHeroCarousel();
}

function scheduleHeroCarousel() {
  window.clearTimeout(heroTimer);
  heroCarouselProgress?.classList.remove('is-running');
  if (prefersReducedMotion || heroCarouselPaused || !heroCarouselVisible || document.hidden) return;
  restartHeroProgress();
  heroTimer = window.setTimeout(() => setHeroLook(heroIndex + 1), 3000);
}

heroLookButtons.forEach((button, index) => {
  button.setAttribute('aria-pressed', String(index === heroIndex));
  button.addEventListener('click', () => setHeroLook(index));
});

function pauseHeroCarousel() {
  heroCarouselPaused = true;
  window.clearTimeout(heroTimer);
  heroCarouselProgress?.classList.remove('is-running');
}
function resumeHeroCarousel() {
  heroCarouselPaused = false;
  scheduleHeroCarousel();
}
heroVisual?.addEventListener('mouseenter', pauseHeroCarousel);
heroVisual?.addEventListener('mouseleave', resumeHeroCarousel);
heroVisual?.addEventListener('focusin', pauseHeroCarousel);
heroVisual?.addEventListener('focusout', event => {
  if (!heroVisual.contains(event.relatedTarget)) resumeHeroCarousel();
});

if (heroVisual) {
  const heroVisibilityObserver = new IntersectionObserver(([entry]) => {
    heroCarouselVisible = entry.isIntersecting;
    scheduleHeroCarousel();
  }, { threshold: 0.25 });
  heroVisibilityObserver.observe(heroVisual);
}

document.addEventListener('visibilitychange', scheduleHeroCarousel);
scheduleHeroCarousel();

/* Croqui para projeção, um clique por estado */
$$('.projection-card').forEach(card => {
  const visual = $('.projection-visual', card);
  const status = $('.projection-status', card);
  if (!visual) return;
  visual.setAttribute('aria-pressed', 'false');

  if (canHover) {
    visual.addEventListener('pointermove', event => {
      const box = visual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      visual.style.setProperty('--tilt-y', `${x * 3}deg`);
      visual.style.setProperty('--tilt-x', `${y * -3}deg`);
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--tilt-y', '0deg');
      visual.style.setProperty('--tilt-x', '0deg');
    });
  }

  visual.addEventListener('click', () => {
    const revealed = card.classList.toggle('revealed');
    visual.setAttribute('aria-pressed', String(revealed));
    if (status) status.textContent = revealed ? 'Voltar ao croqui' : 'Ver projeção';
  });
});



/* Ficha técnica e comparação opcional */
const dialog = $('#piece-dialog');
const dialogClose = $('#dialog-close');
const dialogTitle = $('#dialog-title');
const dialogConcept = $('#dialog-concept');
const dialogMaterial = $('#dialog-material');
const dialogDetail = $('#dialog-detail');
const dialogSketch = $('#dialog-sketch');
const dialogReal = $('#dialog-real');
const compareRange = $('#compare-range');
const compareWrap = $('#compare-real-wrap');
const compareLine = $('#compare-line');
const dialogViews = $('#dialog-views');
const comparePresetButtons = $$('.compare-presets button');

function updateCompare(value) {
  const numericValue = Number(value);
  if (compareWrap) compareWrap.style.width = `${numericValue}%`;
  if (compareLine) compareLine.style.left = `${numericValue}%`;
  comparePresetButtons.forEach(button => button.classList.toggle('active', Number(button.dataset.compare) === numericValue));
}
comparePresetButtons.forEach(button => button.addEventListener('click', () => {
  if (compareRange) compareRange.value = button.dataset.compare;
  updateCompare(button.dataset.compare);
}));

function setDialogProjection(src, label, activeButton) {
  if (!dialogReal) return;
  dialogReal.classList.add('is-switching');
  window.setTimeout(() => {
    dialogReal.src = src;
    dialogReal.alt = `${dialogTitle?.textContent || 'Peça'}: ${label}`;
    const finish = () => dialogReal.classList.remove('is-switching');
    dialogReal.addEventListener('load', finish, { once: true });
    if (dialogReal.complete) finish();
  }, 150);
  $$('.dialog-view-button', dialogViews).forEach(button => button.classList.toggle('active', button === activeButton));
}

function renderDialogViews(card) {
  if (!dialogViews) return;
  dialogViews.innerHTML = '';
  const views = (card.dataset.views || '').split(';').map(item => item.trim()).filter(Boolean);
  views.forEach((item, index) => {
    const [src, label = `Variação ${index + 1}`] = item.split('|');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `dialog-view-button${index === 0 ? ' active' : ''}`;
    button.setAttribute('aria-label', `Selecionar ${label}`);
    button.innerHTML = `<img src="${src}" alt=""><span>${label}</span>`;
    button.addEventListener('click', () => setDialogProjection(src, label, button));
    dialogViews.appendChild(button);
  });
}
compareRange?.addEventListener('input', event => updateCompare(event.target.value));

$$('.details-button').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.projection-card');
  if (!card || !dialog) return;
  if (dialogTitle) dialogTitle.textContent = card.dataset.piece;
  if (dialogConcept) dialogConcept.textContent = card.dataset.concept;
  if (dialogMaterial) dialogMaterial.textContent = card.dataset.material;
  if (dialogDetail) dialogDetail.textContent = card.dataset.detail;
  const sketch = $('.image-sketch', card);
  const real = $('.image-real', card);
  if (dialogSketch && sketch) {
    dialogSketch.src = sketch.src;
    dialogSketch.alt = sketch.alt;
  }
  if (dialogReal && real) {
    dialogReal.src = real.src;
    dialogReal.alt = real.alt;
  }
  renderDialogViews(card);
  if (compareRange) compareRange.value = 52;
  updateCompare(52);
  dialog.showModal();
  body.classList.add('dialog-open');
}));

function closeDialog() {
  dialog?.close();
  body.classList.remove('dialog-open');
}
dialogClose?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) closeDialog();
});
dialog?.addEventListener('close', () => body.classList.remove('dialog-open'));

$$('.collection-list button[data-piece-target]').forEach(button => button.addEventListener('click', () => {
  const target = $$('.projection-card').find(card => card.dataset.piece === button.dataset.pieceTarget);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  target.classList.remove('focus-piece');
  window.setTimeout(() => target.classList.add('focus-piece'), 350);
  window.setTimeout(() => target.classList.remove('focus-piece'), 1700);
}));



/* Engenharia invisível, leitura guiada por camada */
const layerStage = $('#layer-stage');
const layerToggle = $('#layer-toggle');
const layerReset = $('#layer-reset');
const layerLegendButtons = $$('.layer-legend-button');
const layerDescriptionIndex = $('#layer-description-index');
const layerDescriptionTitle = $('#layer-description-title');
const layerDescriptionCopy = $('#layer-description-copy');
const layerReadoutIndex = $('#layer-readout-index');
const layerReadoutTitle = $('#layer-readout-title');

function clearLayerInspection() {
  if (!layerStage) return;
  [...layerStage.classList].filter(name => name.startsWith('inspect-')).forEach(name => layerStage.classList.remove(name));
}

function setLayerState(open, selectedLayer = null) {
  if (!layerStage) return;
  layerStage.classList.toggle('open', open);
  layerToggle?.setAttribute('aria-pressed', String(open));
  if (layerToggle) layerToggle.textContent = open ? 'Reunir estrutura' : 'Explodir construção';
  clearLayerInspection();
  if (open && selectedLayer) layerStage.classList.add(`inspect-${selectedLayer}`);
}

function selectLayer(button) {
  const layer = button.dataset.layer;
  layerLegendButtons.forEach(item => item.classList.toggle('active', item === button));
  setLayerState(true, layer);
  if (layerDescriptionIndex) layerDescriptionIndex.textContent = `CAMADA ${String(layer).padStart(2, '0')}`;
  if (layerDescriptionTitle) layerDescriptionTitle.textContent = button.dataset.title;
  if (layerDescriptionCopy) layerDescriptionCopy.textContent = button.dataset.copy;
  if (layerReadoutIndex) layerReadoutIndex.textContent = `CAMADA ${String(layer).padStart(2, '0')}`;
  if (layerReadoutTitle) layerReadoutTitle.textContent = button.dataset.title;
}

layerLegendButtons.forEach(button => button.addEventListener('click', () => selectLayer(button)));
layerToggle?.addEventListener('click', () => {
  const willOpen = !layerStage?.classList.contains('open');
  setLayerState(willOpen);
  layerLegendButtons.forEach(button => button.classList.remove('active'));
  if (layerReadoutIndex) layerReadoutIndex.textContent = willOpen ? 'CONSTRUÇÃO EXPLODIDA' : 'ESTRUTURA COMPLETA';
  if (layerReadoutTitle) layerReadoutTitle.textContent = willOpen ? 'Cinco funções, uma silhueta' : 'Forma sustentada por dentro';
});
layerReset?.addEventListener('click', () => {
  setLayerState(false);
  layerLegendButtons.forEach(button => button.classList.remove('active'));
  if (layerReadoutIndex) layerReadoutIndex.textContent = 'ESTRUTURA COMPLETA';
  if (layerReadoutTitle) layerReadoutTitle.textContent = 'Forma sustentada por dentro';
});

/* Lookbook, carrossel automático de 1 segundo com navegação manual */
const lookbookShell = $('.lookbook-shell');
const lookbook = $('#lookbook-track');
const lookbookFigures = lookbook ? $$('figure', lookbook) : [];
const lookbookPrev = $('#lookbook-prev');
const lookbookNext = $('#lookbook-next');
const trackProgress = $('#track-progress');
const lookbookCurrent = $('#lookbook-current');
const lookbookTotal = $('#lookbook-total');
const LOOKBOOK_INTERVAL = 1000;
let lookbookIndex = 0;
let lookbookTimer = null;
let lookbookPaused = false;
let isDragging = false;
let dragStart = 0;
let scrollStart = 0;
let scrollFrame = null;

if (lookbookTotal) lookbookTotal.textContent = String(lookbookFigures.length).padStart(2, '0');

function lookbookTargetLeft(index) {
  const figure = lookbookFigures[index];
  if (!lookbook || !figure) return 0;
  return figure.offsetLeft;
}

function updateLookbookUI(index = lookbookIndex) {
  if (!lookbookFigures.length) return;
  lookbookIndex = (index + lookbookFigures.length) % lookbookFigures.length;
  if (lookbookCurrent) lookbookCurrent.textContent = String(lookbookIndex + 1).padStart(2, '0');
  if (trackProgress) trackProgress.style.width = `${((lookbookIndex + 1) / lookbookFigures.length) * 100}%`;
  lookbookFigures.forEach((figure, figureIndex) => figure.classList.toggle('is-current', figureIndex === lookbookIndex));
}

function nearestLookbookIndex() {
  if (!lookbook || !lookbookFigures.length) return 0;
  const left = lookbook.scrollLeft;
  let nearest = 0;
  let distance = Infinity;
  lookbookFigures.forEach((figure, index) => {
    const currentDistance = Math.abs(figure.offsetLeft - left);
    if (currentDistance < distance) {
      distance = currentDistance;
      nearest = index;
    }
  });
  return nearest;
}

function goToLookbook(index, restart = true) {
  if (!lookbook || !lookbookFigures.length) return;
  lookbookIndex = (index + lookbookFigures.length) % lookbookFigures.length;
  lookbook.scrollTo({
    left: lookbookTargetLeft(lookbookIndex),
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });
  updateLookbookUI(lookbookIndex);
  if (restart) startLookbookCarousel();
}

function stopLookbookCarousel() {
  if (lookbookTimer) window.clearInterval(lookbookTimer);
  lookbookTimer = null;
}

function startLookbookCarousel() {
  stopLookbookCarousel();
  if (!lookbookFigures.length || lookbookPaused || document.hidden) return;
  lookbookTimer = window.setInterval(() => {
    if (!lookbookPaused && !document.hidden) goToLookbook(lookbookIndex + 1, false);
  }, LOOKBOOK_INTERVAL);
}

lookbookPrev?.addEventListener('click', () => {
  lookbookPaused = false;
  goToLookbook(lookbookIndex - 1);
});
lookbookNext?.addEventListener('click', () => {
  lookbookPaused = false;
  goToLookbook(lookbookIndex + 1);
});

lookbook?.addEventListener('scroll', () => {
  window.cancelAnimationFrame(scrollFrame);
  scrollFrame = window.requestAnimationFrame(() => updateLookbookUI(nearestLookbookIndex()));
}, { passive: true });

lookbook?.addEventListener('pointerdown', event => {
  isDragging = true;
  lookbookPaused = true;
  stopLookbookCarousel();
  dragStart = event.clientX;
  scrollStart = lookbook.scrollLeft;
  lookbook.setPointerCapture?.(event.pointerId);
});
lookbook?.addEventListener('pointermove', event => {
  if (!isDragging) return;
  lookbook.scrollLeft = scrollStart - (event.clientX - dragStart);
});
function finishLookbookDrag() {
  if (!isDragging) return;
  isDragging = false;
  lookbookPaused = false;
  goToLookbook(nearestLookbookIndex());
}
lookbook?.addEventListener('pointerup', finishLookbookDrag);
lookbook?.addEventListener('pointercancel', finishLookbookDrag);
lookbook?.addEventListener('lostpointercapture', finishLookbookDrag);
lookbook?.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    lookbookPaused = false;
    goToLookbook(lookbookIndex + 1);
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    lookbookPaused = false;
    goToLookbook(lookbookIndex - 1);
  }
});

// Pausa apenas enquanto o usuário interage com controles e retoma logo depois.
lookbookShell?.addEventListener('mouseenter', () => { lookbookPaused = false; });
lookbookShell?.addEventListener('mouseleave', () => { lookbookPaused = false; startLookbookCarousel(); });
lookbook?.addEventListener('focusin', () => stopLookbookCarousel());
lookbook?.addEventListener('focusout', () => { lookbookPaused = false; startLookbookCarousel(); });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopLookbookCarousel();
  else startLookbookCarousel();
});

updateLookbookUI(0);
startLookbookCarousel();

/* Contato */
const contactForm = $('#contact-form');
const formStatus = $('#form-status');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`[Site ZECK SANTOS] ${data.get('interesse')}`);
  const bodyText = encodeURIComponent(`Nome: ${data.get('nome')}\nE-mail: ${data.get('email')}\nInteresse: ${data.get('interesse')}\n\nMensagem:\n${data.get('mensagem')}`);
  if (formStatus) formStatus.textContent = 'Abrindo seu aplicativo de e-mail.';
  window.location.href = `mailto:comercial@zecksantos.com?subject=${subject}&body=${bodyText}`;
});
