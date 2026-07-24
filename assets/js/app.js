(() => {
  'use strict';
  const assets = window.ZECK_ASSETS;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader')?.classList.add('hidden'), reduceMotion ? 50 : 900);
  });

  const header = $('#siteHeader');
  const progress = $('#pageProgress');
  const updateScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir navegação');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Abrir navegação' : 'Fechar navegação');
    mobileMenu.classList.toggle('open', !open);
    mobileMenu.setAttribute('aria-hidden', String(open));
    document.body.classList.toggle('menu-open', !open);
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  const heroSlides = [
    { src: 'assets/images/looks/preto-look-2.webp', title: 'Vestido Pulso', desc: 'Geometria rigorosa, fluidez monumental.', alt: 'Vestido Pulso em preto em estúdio arquitetônico' },
    { src: 'assets/images/looks/grafite-look-1.webp', title: 'Blazer Fluxo + Calça Trajeto', desc: 'Estrutura precisa sobre um eixo vertical.', alt: 'Blazer Fluxo e Calça Trajeto em grafite' },
    { src: 'assets/images/looks/champagne-look-1.webp', title: 'Blazer Fluxo + Saia Ritmo', desc: 'Luz, arquitetura e movimento acetinado.', alt: 'Blazer Fluxo e Saia Ritmo em champagne' },
    { src: 'assets/images/looks/borgonha-look-1.webp', title: 'Vestido Pulso', desc: 'Energia feminina contida e presença estratégica.', alt: 'Vestido Pulso em borgonha' }
  ];
  const heroImage = $('#heroImage');
  const heroTitle = $('#heroLookTitle');
  const heroDesc = $('#heroLookDescription');
  const heroNumber = $('#heroNumber');
  const heroDots = $('#heroDots');
  const heroTimer = $('#heroTimer');
  const heroPause = $('#heroPause');
  const heroCarousel = $('#heroCarousel');
  let heroIndex = 0;
  let heroPaused = reduceMotion;
  let heroInterval = null;
  let heroProgressAnimation = null;
  const heroDuration = 5000;

  heroSlides.forEach((slide, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = String(index + 1).padStart(2, '0');
    btn.setAttribute('aria-label', `Mostrar ${slide.title}`);
    btn.addEventListener('click', () => { showHero(index); pauseHeroTemporarily(); });
    heroDots?.append(btn);
  });

  function animateHeroTimer() {
    if (!heroTimer || heroPaused || reduceMotion) return;
    heroProgressAnimation?.cancel();
    heroTimer.style.width = '0%';
    heroProgressAnimation = heroTimer.animate([{ width: '0%' }, { width: '100%' }], { duration: heroDuration, easing: 'linear' });
  }
  function showHero(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[heroIndex];
    const wrap = heroImage?.parentElement;
    wrap?.classList.add('switching');
    setTimeout(() => {
      if (heroImage) { heroImage.src = slide.src; heroImage.alt = slide.alt; }
      if (heroTitle) heroTitle.textContent = slide.title;
      if (heroDesc) heroDesc.textContent = slide.desc;
      if (heroNumber) heroNumber.textContent = `LOOK ${String(heroIndex + 1).padStart(2, '0')}`;
      $$('#heroDots button').forEach((b, i) => b.classList.toggle('active', i === heroIndex));
      wrap?.classList.remove('switching');
      animateHeroTimer();
    }, reduceMotion ? 0 : 220);
  }
  function startHero() {
    clearInterval(heroInterval);
    if (heroPaused || reduceMotion) return;
    heroInterval = setInterval(() => showHero(heroIndex + 1), heroDuration);
    animateHeroTimer();
  }
  function pauseHeroTemporarily() {
    clearInterval(heroInterval);
    heroProgressAnimation?.pause();
    if (!heroPaused && !reduceMotion) setTimeout(startHero, 7000);
  }
  heroPause?.addEventListener('click', () => {
    heroPaused = !heroPaused;
    heroPause.setAttribute('aria-pressed', String(heroPaused));
    heroPause.textContent = heroPaused ? '▶' : 'Ⅱ';
    heroPause.setAttribute('aria-label', heroPaused ? 'Retomar carrossel' : 'Pausar carrossel');
    heroPaused ? clearInterval(heroInterval) : startHero();
  });
  heroCarousel?.addEventListener('pointerenter', () => { if (!heroPaused) clearInterval(heroInterval); });
  heroCarousel?.addEventListener('pointerleave', () => { if (!heroPaused) startHero(); });
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(heroInterval) : startHero());
  const heroObserver = new IntersectionObserver(([entry]) => entry.isIntersecting ? startHero() : clearInterval(heroInterval), { threshold: .25 });
  if (heroCarousel) heroObserver.observe(heroCarousel);
  showHero(0);

  const pieceOrder = ['vestido','blazer','saia','colete','calca','camisa'];
  const pieceTabs = $('#pieceTabs');
  const projectionColors = $('#projectionColors');
  const sketchImage = $('#sketchImage');
  const projectionImage = $('#projectionImage');
  const projectionStage = $('#projectionStage');
  const projectionPieceLabel = $('#projectionPieceLabel');
  const projectionColorLabel = $('#projectionColorLabel');
  const pieceTitle = $('#pieceTitle');
  const pieceConcept = $('#pieceConcept');
  const pieceMaterial = $('#pieceMaterial');
  const pieceDetail = $('#pieceDetail');
  const compareRange = $('#compareRange');
  const compareOutput = $('#compareOutput');
  const stageSteps = $$('#stageSteps span');
  let currentPieceKey = 'vestido';
  let currentColor = 'preto';
  let projectionAnimating = false;

  function projectionPath(pieceKey, color) {
    const model = assets.pieces[pieceKey].projections[color];
    return `assets/images/looks/${color}-look-${model}.webp`;
  }
  function availableColors(pieceKey) { return Object.keys(assets.pieces[pieceKey].projections); }
  function setSplit(value) {
    projectionStage?.style.setProperty('--split', `${value}%`);
    if (compareRange) compareRange.value = String(value);
    if (compareOutput) compareOutput.value = `${value}%`;
  }
  function renderPieceTabs() {
    pieceTabs.innerHTML = '';
    pieceOrder.forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = assets.pieces[key].name;
      btn.className = key === currentPieceKey ? 'active' : '';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(key === currentPieceKey));
      btn.addEventListener('click', () => selectPiece(key));
      pieceTabs.append(btn);
    });
  }
  function renderProjectionColors() {
    projectionColors.innerHTML = '';
    availableColors(currentPieceKey).forEach(color => {
      const data = assets.colors[color];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.setProperty('--chip', data.hex);
      btn.className = color === currentColor ? 'active' : '';
      btn.setAttribute('aria-label', data.name);
      btn.setAttribute('aria-pressed', String(color === currentColor));
      btn.addEventListener('click', () => { currentColor = color; updateProjection(true); });
      projectionColors.append(btn);
    });
  }
  function updateProjection(reset = false) {
    const piece = assets.pieces[currentPieceKey];
    if (!piece.projections[currentColor]) currentColor = availableColors(currentPieceKey)[0];
    sketchImage.src = piece.sketch;
    sketchImage.alt = `Croqui original de ${piece.name}`;
    projectionImage.src = projectionPath(currentPieceKey, currentColor);
    projectionImage.alt = `Projeção conceitual de ${piece.name} em ${assets.colors[currentColor].name}`;
    projectionPieceLabel.textContent = piece.name;
    projectionColorLabel.textContent = assets.colors[currentColor].name;
    pieceTitle.textContent = piece.name;
    pieceConcept.textContent = piece.concept;
    pieceMaterial.textContent = piece.material;
    pieceDetail.textContent = piece.detail;
    renderPieceTabs();
    renderProjectionColors();
    if (reset) { setSplit(100); setStage(0); projectionStage.classList.remove('animating'); }
  }
  function selectPiece(key) {
    currentPieceKey = key;
    currentColor = availableColors(key)[0];
    updateProjection(true);
  }
  function setStage(index) {
    stageSteps.forEach((s, i) => s.classList.toggle('active', i === index));
  }
  async function revealProjection() {
    if (projectionAnimating) return;
    projectionAnimating = true;
    projectionStage.classList.add('animating');
    setSplit(100); setStage(0);
    const stages = reduceMotion ? [0,4] : [0,1,2,3,4];
    for (const stage of stages) {
      setStage(stage);
      if (stage === 1) setSplit(88);
      if (stage === 2) setSplit(70);
      if (stage === 3) setSplit(42);
      if (stage === 4) setSplit(0);
      await wait(reduceMotion ? 20 : 520);
    }
    projectionStage.classList.remove('animating');
    projectionAnimating = false;
  }
  $('#revealProjection')?.addEventListener('click', revealProjection);
  $('#resetProjection')?.addEventListener('click', () => { setSplit(100); setStage(0); projectionStage.classList.remove('animating'); });
  compareRange?.addEventListener('input', e => setSplit(Number(e.target.value)));
  updateProjection(true);

  const familyGrid = $('#familyGrid');
  assets.families.forEach(family => {
    const data = assets.colors[family.color];
    const card = document.createElement('article');
    card.className = 'family-card reveal-on-scroll';
    card.innerHTML = `
      <div class="family-head">
        <div class="family-name"><i class="family-chip" style="--family-color:${data.hex}"></i>${data.name}</div>
        <div class="family-switch" role="group" aria-label="Alternar modelos em ${data.name}">
          <button type="button" class="active" aria-pressed="true">A</button>
          <button type="button" aria-pressed="false">B</button>
        </div>
      </div>
      <div class="family-images">
        <figure class="family-image active"><img loading="lazy" src="${family.looks[0]}" alt="${data.structured} na família ${data.name}"><span>Estruturado · ${data.structured}</span></figure>
        <figure class="family-image"><img loading="lazy" src="${family.looks[1]}" alt="${data.fluid} na família ${data.name}"><span>Fluido · ${data.fluid}</span></figure>
      </div>
      <div class="family-copy"><p><strong>LOOK A</strong> · ${data.structured}</p><p><strong>LOOK B</strong> · ${data.fluid}</p></div>`;
    const switches = $$('button', card);
    switches.forEach((btn, index) => btn.addEventListener('click', () => {
      switches.forEach((b, i) => { b.classList.toggle('active', i === index); b.setAttribute('aria-pressed', String(i === index)); });
      $$('.family-image', card).forEach((img, i) => img.classList.toggle('active', i === index));
    }));
    familyGrid.append(card);
  });

  $$('[data-piece-jump]').forEach(btn => btn.addEventListener('click', () => {
    selectPiece(btn.dataset.pieceJump);
    document.querySelector('#croqui')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  const layerData = [
    ['01 · MARFIM','Tecido externo','A superfície visível protege a construção e define textura, cor e primeira leitura da silhueta.'],
    ['02 · CHAMPAGNE','Estrutura bonded','Tecidos dublados formam uma base estável, reduzindo costuras aparentes e mantendo linhas contínuas.'],
    ['03 · TAUPE','Entretela de alta gramatura','A camada de sustentação preserva a geometria da lapela, do ombro e da cintura ao longo do uso.'],
    ['04 · BORGONHA','Dublagem estratégica','Reforços localizados distribuem tensão e ajudam o tecido a acompanhar o corpo sem perder memória de forma.'],
    ['05 · CAFÉ ESPRESSO','Forro técnico','O acabamento interno reduz atrito, melhora o vestir e mantém o sistema construtivo invisível.']
  ];
  const layerView = $('#layerView');
  function selectLayer(index) {
    $$('.layer', layerView).forEach((l, i) => l.classList.toggle('active', i === index));
    layerView.classList.add('inspecting');
    $('#layerNumber').textContent = layerData[index][0];
    $('#layerTitle').textContent = layerData[index][1];
    $('#layerText').textContent = layerData[index][2];
  }
  $$('.layer', layerView).forEach((layer, index) => layer.addEventListener('click', () => selectLayer(index)));
  $('#explodeLayers')?.addEventListener('click', () => { layerView.classList.add('exploded'); layerView.classList.remove('inspecting'); });
  $('#gatherLayers')?.addEventListener('click', () => { layerView.classList.remove('exploded','inspecting'); $$('.layer', layerView).forEach((l,i)=>l.classList.toggle('active',i===0)); selectLayer(0); layerView.classList.remove('inspecting'); });

  const lookbookTrack = $('#lookbookTrack');
  const allLooks = assets.families.flatMap(f => f.looks.map((src, index) => ({ src, color:f.color, model:index+1 })));
  allLooks.forEach((look, index) => {
    const data = assets.colors[look.color];
    const card = document.createElement('article');
    card.className = 'lookbook-card';
    card.innerHTML = `<img loading="lazy" src="${look.src}" alt="Look ${index+1} da família ${data.name}"><div><strong>${data.name}</strong><span>${String(index+1).padStart(2,'0')} / 16 · Modelo ${look.model === 1 ? 'A' : 'B'}</span></div>`;
    lookbookTrack.append(card);
  });
  let lookIndex = 0;
  let lookPaused = reduceMotion;
  let lookInterval = null;
  let lookProgressAnimation = null;
  const lookDuration = 6000;
  function cardStep() {
    const first = $('.lookbook-card', lookbookTrack);
    if (!first) return 0;
    return first.getBoundingClientRect().width + 14;
  }
  function showLook(index) {
    lookIndex = (index + allLooks.length) % allLooks.length;
    lookbookTrack.style.transform = `translateX(${-lookIndex * cardStep()}px)`;
    $('#lookCounter').textContent = `${String(lookIndex+1).padStart(2,'0')} / 16`;
    animateLookProgress();
  }
  function animateLookProgress() {
    const bar = $('#lookProgress');
    if (!bar || lookPaused || reduceMotion) return;
    lookProgressAnimation?.cancel();
    lookProgressAnimation = bar.animate([{width:'0%'},{width:'100%'}],{duration:lookDuration,easing:'linear'});
  }
  function startLookbook() {
    clearInterval(lookInterval);
    if (lookPaused || reduceMotion) return;
    lookInterval = setInterval(() => showLook(lookIndex+1), lookDuration);
    animateLookProgress();
  }
  function pauseLookbookTemporarily() {
    clearInterval(lookInterval);
    if (!lookPaused && !reduceMotion) setTimeout(startLookbook, 7000);
  }
  $('#lookPrev')?.addEventListener('click', () => { showLook(lookIndex-1); pauseLookbookTemporarily(); });
  $('#lookNext')?.addEventListener('click', () => { showLook(lookIndex+1); pauseLookbookTemporarily(); });
  $('#lookPause')?.addEventListener('click', e => {
    lookPaused = !lookPaused;
    e.currentTarget.setAttribute('aria-pressed', String(lookPaused));
    e.currentTarget.textContent = lookPaused ? '▶' : 'Ⅱ';
    e.currentTarget.setAttribute('aria-label', lookPaused ? 'Retomar lookbook' : 'Pausar lookbook');
    lookPaused ? clearInterval(lookInterval) : startLookbook();
  });
  lookbookTrack?.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); showLook(lookIndex+1); pauseLookbookTemporarily(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); showLook(lookIndex-1); pauseLookbookTemporarily(); }
  });
  let dragStart = 0;
  lookbookTrack?.addEventListener('pointerdown', e => { dragStart = e.clientX; lookbookTrack.setPointerCapture(e.pointerId); clearInterval(lookInterval); });
  lookbookTrack?.addEventListener('pointerup', e => {
    const distance = e.clientX - dragStart;
    if (Math.abs(distance) > 45) showLook(lookIndex + (distance < 0 ? 1 : -1));
    pauseLookbookTemporarily();
  });
  window.addEventListener('resize', () => showLook(lookIndex));
  const lookObserver = new IntersectionObserver(([entry]) => entry.isIntersecting ? startLookbook() : clearInterval(lookInterval), { threshold:.2 });
  if (lookbookTrack) lookObserver.observe(lookbookTrack);
  showLook(0);

  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const note = $('#formNote');
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    note.textContent = 'Formulário validado. Configure um endpoint, Formspree ou Netlify Forms antes da publicação para realizar o envio.';
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold:.12 });
  $$('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
})();
