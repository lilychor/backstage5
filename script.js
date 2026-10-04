(function () {
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  // Scroll-in reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  qsa('[data-reveal]').forEach(el => revealObserver.observe(el));

  // Chapter A: accountability choice
  const aButtons = qsa('[data-choice-group="a"] .choice-card');
  const aResponse = qs('[data-response="a"]');
  aButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      aButtons.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      aResponse.innerHTML = `YOU CHOSE <strong>${btn.dataset.choice}</strong> — but who actually has the power to answer?`;
    });
  });

  // Chapter B: labour layer reveal
  const layerButtons = qsa('[data-layer]');
  const layerDetail = qs('[data-layer-detail]');
  const layerCopy = {
    'SCRIPT': 'Every seemingly natural expression begins with scripting, topic selection, and language design.',
    'CHARACTER DESIGN': 'Who FANG TAOZI is does not simply exist; it is shaped through ongoing choices about persona, tone, and visual identity.',
    'VISUAL PRODUCTION': 'Images, styling, poses, settings, and overall aesthetics all require a real visual production process.',
    'EDITING': 'A seemingly effortless post can involve extensive selection, revision, pacing, and versioning.',
    'MANAGEMENT': 'Publishing schedules, account management, comment moderation, and daily maintenance keep a persona continuously present.',
    'BRAND COLLABORATION': 'Brand collaborations connect a virtual persona to real brands, contracts, markets, and consumers.'
  };
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      layerButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const key = btn.dataset.layer;
      layerDetail.innerHTML = `<div class="mono">${key}</div><p>${layerCopy[key]}</p>`;
    });
  });

  // Chapter C: fast-choice quiz
  const questions = qsa('.quiz-screen');
  const result = qs('[data-result]');
  const progressBar = qs('[data-progress-bar]');
  const progressLabel = qs('[data-progress-label]');
  const resultList = qs('[data-result-list]');
  const answers = {};
  let current = 1;

  const answerLabels = {
    'Q1: FANG TAOZI': 'The virtual character',
    'Q1: CREATIVE TEAM': 'The creative team behind her',
    'Q1: BRAND': 'The brand',
    'Q1: PLATFORM': 'The platform',
    'Q1: SHARED': 'Shared responsibility',
    'Q2: PERSONA': 'YES: I interact with her as a persona',
    'Q2: IP': 'NO: I see her as an IP',
    'Q2: DEPENDS': 'IT DEPENDS: real emotions, without treating her as a real person',
    'Q2: CONTENT': 'I DON’T MIND: content and influence matter more',
    'Q3: YES': 'YES',
    'Q3: NO': 'NO',
    'Q3: DEPENDS': 'IT DEPENDS'
  };

  function showQuestion(num) {
    current = num;
    questions.forEach(q => q.classList.toggle('active', Number(q.dataset.question) === num));
    result.classList.remove('active');
    progressBar.style.width = `${(num / 3) * 100}%`;
    progressLabel.textContent = `QUESTION ${String(num).padStart(2, '0')} / 03`;
  }

  function showResult() {
    questions.forEach(q => q.classList.remove('active'));
    result.classList.add('active');
    progressBar.style.width = '100%';
    progressLabel.textContent = 'COMPLETE / 03';
    const labels = [
      ['RESPONSIBILITY', answers.q1 || '—'],
      ['IDENTITY', answers.q2 || '—'],
      ['ACCOUNTABILITY', answers.q3 || '—']
    ];
    resultList.innerHTML = labels.map(([label, key]) => `<div class="result-item"><div class="result-item__label">${label}</div><div class="result-item__answer">${answerLabels[key] || key}</div></div>`).join('');
  }

  qsa('.quiz-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.closest('.quiz-screen');
      const n = Number(screen.dataset.question);
      screen.querySelectorAll('button').forEach(b => b.classList.remove('is-picked'));
      btn.classList.add('is-picked');
      answers[`q${n}`] = btn.dataset.answer;
      window.setTimeout(() => {
        if (n < 3) showQuestion(n + 1);
        else showResult();
      }, 280);
    });
  });

  const resetBtn = qs('[data-reset]');
  resetBtn.addEventListener('click', () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    qsa('.quiz-options button').forEach(b => b.classList.remove('is-picked'));
    showQuestion(1);
  });

  // Custom cursor only on fine pointers
  const cursor = qs('.cursor-ring');
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.classList.add('is-visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  }

  // Keyboard focus hint for buttons
  qsa('button, a').forEach(el => {
    el.addEventListener('focus', () => el.classList.add('focus-visible'));
    el.addEventListener('blur', () => el.classList.remove('focus-visible'));
  });

  showQuestion(1);
})();
