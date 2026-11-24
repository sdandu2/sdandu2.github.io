import { journeyChapters } from './journey-data.mjs';
import { cinemaMarkup, cinemaChapterCopy, mountParticleField } from './journey-cinema.mjs';
import { mountExperienceStack3D } from './experience-stack-3d.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = () => matchMedia('(max-width: 1110px)').matches;
const N = journeyChapters.length;
const shortNames = ['UIC', 'Ensar', 'Komatsu', 'UMD', 'TeckPulse', 'Projects', 'Robotics'];
const stackLabels = ['Data Science / UIC', 'Ensar Solutions', 'Komatsu North America', 'Graduate ML / UMD', 'TeckPulse', 'Independent Engineering', 'Robotics / Next'];
const stackSignals = [
  'FOUNDATIONS / Early undergraduate work',
  'DATA QUALITY / 2023',
  'AUTOMATION / 2024–2025',
  'RESEARCH / Expected May 2027',
  'OPTIMIZATION / 2025–2026',
  'SYSTEMS / Personal projects',
  'FUTURE / Current exploration'
];


export function mountJourney() {
  const section = document.getElementById('journey');
  if (!section) return null;
  const $ = id => section.querySelector('#' + id);
  const film = $('journey-scroll-film');
  const stage = $('journey-stage');
  const scene = $('journey-visual');
  const number = $('journey-index');
  const label = $('journey-stage-label');
  const legend = $('journey-legend');
  const narrative = $('journey-narrative');
  const progress = $('journey-progress-fill');
  const controls = $('journey-controls');
  const playButton = $('journey-play');
  const prev = $('journey-previous');
  const next = $('journey-next');
  const skip = $('journey-skip');
  const roadmap = $('journey-roadmap');
  const cards = $('journey-roadmap-cards');
  const stackReadout = $('journey-stack-readout');
  const status = $('journey-status');
  const modeLabel = $('journey-playback-mode');
  const playbackStatus = $('journey-playback-live-status');
  const scrubber = $('journey-chapter-scrubber');
  const stackPreviousButton = $('journey-stack-previous');
  const stackNextButton = $('journey-stack-next');
  const stackResetButton = $('journey-stack-reset');
  const stackModeButton = $('journey-stack-mode');
  const stackProgressLabel = $('journey-stack-progress');

  let chapter = 0;
  let percent = 0;
  let isPlaying = false;
  let hasPlayed = false;
  let raf = 0;
  let pending = 0;
  let lastTime = 0;
  let stackActive = 0;
  let peelMode = true;

  scrubber.innerHTML = shortNames.map((name, i) =>
    `<button type="button" data-journey-jump="${i}" aria-label="Go to chapter ${i + 1}, ${esc(name)}" aria-current="false"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(name)}</strong></button>`
  ).join('');

  scene.innerHTML = cinemaMarkup(journeyChapters);
  // Actual campus / industrial / GPU / quadruped photos are hosted by their
  // publishers. Offline fallbacks are explicit, not silently rewritten artwork.
  scene.querySelectorAll('.cinema-editorial img').forEach(img => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.journeyFallback;
      if (fallback && img.getAttribute('src') !== fallback) {
        img.src = fallback;
      } else {
        img.style.display = 'none';
        img.parentElement.classList.add('image-unavailable');
      }
    });
  });
  const particles = mountParticleField(scene.querySelector('#cinema-particle-field'), () => percent);
  scene.addEventListener('pointermove', evt => {
    if (reduced() || matchMedia('(pointer: coarse)').matches) return;
    const r = scene.getBoundingClientRect();
    scene.style.setProperty('--cinema-pointer-x', ((evt.clientX - r.left) / r.width - .5).toFixed(3));
    scene.style.setProperty('--cinema-pointer-y', ((evt.clientY - r.top) / r.height - .5).toFixed(3));
  }, { passive: true });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--cinema-pointer-x', '0');
    scene.style.setProperty('--cinema-pointer-y', '0');
  });
  const sceneMotifs = [...scene.querySelectorAll('[data-journey-motif]')];
  // The same normalized story position drives artwork, letterforms and particle formations.
  // Each word keeps a natural text wrap; each character receives a staggered transform.
  const titleLetters = value => String(value).split(/(\s+)/).map((part,wi) => {
    if(/^\s+$/.test(part)) return esc(part);
    return `<span class="cinema-title-word" aria-hidden="true">${Array.from(part).map((ch,j)=>`<span class="cinema-title-letter" style="--char-order:${j};">${esc(ch)}</span>`).join('')}</span>`;
  }).join('');
  narrative.innerHTML = `<div class="cinema-copy-deck">${journeyChapters.map((c,i)=>{
      const cinema = cinemaChapterCopy[i] ?? {};
      const phase = cinema.phase ?? c.phase;
      const place = cinema.place ?? c.place;
      const title = cinema.title ?? c.title;
      const description = cinema.description ?? c.story[0];
      return `<section class="cinema-copy-slide" data-copy-chapter="${i}" aria-hidden="${i!==0}">
        <div class="journey-narrative-meta"><span>${esc(phase)}</span></div>
        <p class="journey-place">${esc(place)}</p>
        <h3><span class="cinema-title-visible" aria-hidden="true">${titleLetters(title)}</span><span class="cinema-visually-hidden">${esc(title)}</span></h3>
        <div class="journey-narrative-copy"><p>${esc(description)}</p></div>
        <a class="journey-scene-readmore" href="#journey-roadmap" aria-label="Read the complete chapter in the career stack">Read the complete chapter</a>
      </section>`;
    }).join('')}</div>`;
  const copySlides=[...narrative.querySelectorAll('[data-copy-chapter]')];
  const letterGroups=copySlides.map(slide=>[...slide.querySelectorAll('.cinema-title-letter')]);
  cards.innerHTML = journeyChapters.map((c, i) => `
    <button type="button" class="journey-stack-layer" data-journey-map="${i}" aria-label="Inspect layer ${i + 1}: ${esc(c.place)}" aria-pressed="false" style="--layer:${i};--layer-color:${esc(c.tone)}">
      <span class="journey-stack-glass-top" aria-hidden="true"></span>
      <span class="journey-stack-thickness" aria-hidden="true"></span>
      <span class="journey-stack-layer-count">${String(i + 1).padStart(2, '0')}</span>
      <span class="journey-stack-layer-main">
        <strong class="journey-stack-layer-name">${esc(stackLabels[i])}</strong>
        <span class="journey-stack-layer-signal">${esc(stackSignals[i])}</span>
      </span>
      <span class="journey-stack-layer-dot" aria-hidden="true"></span>
    </button>`).join('');

  // Mount the actual WebGL scene over the existing accessible experience buttons.
  // On unsupported devices, the old HTML stack remains available as a fallback.
  const stackRenderer = mountExperienceStack3D(cards, index => {
    if (peelMode && index === stackActive && stackActive < N - 1) selectStack(stackActive + 1);
    else selectStack(index);
  });

  function selectStack(i) {
    stackActive = Math.round(clamp(i, 0, N - 1));
    const c = journeyChapters[stackActive];
    cards.dataset.mode = peelMode ? 'peel' : 'browse';
    cards.style.setProperty('--active-layer', String(stackActive));
    cards.querySelectorAll('[data-journey-map]').forEach((b, j) => {
      const removed = peelMode && j < stackActive;
      const depth = peelMode ? j - stackActive : j;
      b.style.setProperty('--stack-depth', String(Math.max(0,depth)));
      b.classList.toggle('is-removed', removed);
      b.classList.toggle('is-selected', j === stackActive);
      b.tabIndex = removed ? -1 : stackRenderer.available ? (j === stackActive ? 0 : -1) : 0;
      b.setAttribute('aria-hidden', String(removed));
      b.setAttribute('aria-pressed', String(j === stackActive));
      b.setAttribute('aria-label', `${j === stackActive && peelMode && j < N-1 ? 'Lift this layer to reveal the next chapter' : 'Inspect chapter'} ${j+1}: ${journeyChapters[j].title}`);
    });
    stackRenderer.select(stackActive, peelMode);
    stackPreviousButton.disabled = stackActive === 0;
    stackNextButton.disabled = stackActive === N-1;
    stackNextButton.textContent = stackActive === N-1 ? 'Final chapter reached' : peelMode ? 'Lift next layer' : 'Next chapter';
    stackPreviousButton.textContent = peelMode ? 'Put back' : 'Previous';
    stackResetButton.disabled = stackActive === 0 && peelMode;
    stackModeButton.setAttribute('aria-pressed', String(peelMode));
    stackModeButton.innerHTML = `<span class="stack-mode-dot" aria-hidden="true"></span> Peel mode: ${peelMode ? 'On' : 'Off'} <span class="stack-mode-hint">· ${peelMode ? 'click to inspect freely' : 'click to peel layers'}</span>`;
    stackProgressLabel.textContent = `${String(stackActive+1).padStart(2,'0')} / ${String(N).padStart(2,'0')}`;
    stackReadout.innerHTML = `
      <div class="journey-stack-readout-top"><span>INSPECTING LAYER ${String(stackActive + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}</span><span class="journey-stack-led" aria-hidden="true"></span></div>
      <p class="journey-stack-phase"><span>${esc(c.phase)}</span><span>${esc(c.period)}</span></p>
      <p class="journey-stack-place">${esc(c.place)}</p>
      <h4>${esc(c.title)}</h4>
      <div class="journey-stack-longform">${c.story.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div>
      <div class="journey-stack-key"><span>WHAT STAYED WITH ME</span><strong>${esc(c.learning)}</strong></div>
      <div class="journey-stack-actions"><button type="button" id="journey-stack-revisit" class="journey-secondary-button">See this chapter in motion</button>${c.id === 'flagships' ? '<a href="#engine" class="journey-stack-network">Explore my project network</a>' : ''}</div>`;
    stackReadout.querySelector('#journey-stack-revisit')?.addEventListener('click', () => goTo(stackActive));
  }

  function sceneProgress(t) {
    percent = clamp(t);
    progress.style.width = `${(percent * 100).toFixed(2)}%`;
    controls.setAttribute('aria-valuenow', String(Math.round(percent * 100)));
    section.style.setProperty('--journey-scroll-progress', String(percent));
    const storyPosition = percent * (N - 1);
    const nearest = Math.round(storyPosition);
    sceneMotifs.forEach((motif, i) => {
      const delta = storyPosition - i;
      const proximity = Math.max(0, 1 - Math.abs(delta));
      const visible = proximity * proximity * (3 - 2 * proximity);
      // A soft camera drift and translucent cross-dissolve; no fixed journey path.
      motif.style.opacity = visible.toFixed(4);
      motif.style.transform = `translate3d(${(-delta * 13).toFixed(2)}vw, ${(delta * 25).toFixed(1)}px, 0) scale(${(0.92 + visible * .08).toFixed(4)})`;
      motif.style.filter = reduced() ? 'none' : `blur(${((1 - visible) * 13).toFixed(1)}px)`;
      motif.style.visibility = Math.abs(delta) < 1.01 ? 'visible' : 'hidden';
      motif.setAttribute('aria-hidden', String(i !== nearest));
    });
    // No overlapping readable paragraphs during a cross-chapter dissolve.
    // Text departs before the visual midpoint and the next chapter arrives just
    // afterward; everything still follows the exact same storyPosition.
    const leftChapter = Math.floor(storyPosition);
    const fraction = storyPosition - leftChapter;
    const smoothstep = x => { const v=clamp(x); return v*v*(3-2*v); };
    copySlides.forEach((slide,i)=>{
      let reveal = 0;
      if (i === leftChapter) reveal = 1 - smoothstep((fraction-.11)/.31);
      else if (i === leftChapter + 1) reveal = smoothstep((fraction-.57)/.31);
      if (i === N - 1 && storyPosition >= N - 1) reveal = 1;
      const onScreen = reveal > .002;
      slide.style.visibility = onScreen ? 'visible' : 'hidden';
      slide.style.opacity = reveal.toFixed(4);
      slide.style.transform = `translate3d(0,${((1-reveal)*9).toFixed(1)}px,0)`;
      slide.style.setProperty('--copy-visibility',reveal.toFixed(4));
      slide.style.pointerEvents = i === nearest && reveal > .75 ? 'auto' : 'none';
      slide.setAttribute('aria-hidden',String(i !== nearest));
      const letters=letterGroups[i];
      const max=Math.max(1,letters.length-1);
      letters.forEach((letter,j)=>{
        // Very short stagger (at most ~12% of each reveal), not a second clock.
        const stagger=j/max*.12;
        const alpha=smoothstep((reveal-stagger)/(.74-stagger));
        letter.style.opacity=alpha.toFixed(3);
        // Keep glyphs inline so DM Sans can apply natural tracking; animate their relative top offset.
        letter.style.top=`${((1-alpha)*7).toFixed(1)}px`;
        letter.style.filter='none';
      });
      const anchor=slide.querySelector('.journey-scene-readmore');
      if(anchor)anchor.tabIndex=i===nearest&&reveal>.75?0:-1;
    });
    particles.redraw();
  }

  function showChapter(index) {
    index = Math.round(clamp(index, 0, N - 1));
    chapter = index;
    const c = journeyChapters[index];
    number.textContent = `${String(index + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    label.textContent = cinemaChapterCopy[index]?.phase ?? c.phase;
    legend.textContent = c.fact;
    // Do not remount text at the chapter midpoint. Each pre-rendered chapter
    // fades and its individual letters move on the artwork's timeline.
    scrubber.querySelectorAll('[data-journey-jump]').forEach((b, i) => { b.setAttribute('aria-current', String(i === index)); b.classList.toggle('is-current',i===index); });
    prev.disabled = index === 0;
    next.textContent = index === N - 1 ? 'Open the stack' : 'Next chapter';
    next.setAttribute('aria-label', index === N - 1 ? 'Open the career stack' : 'Go to the next chapter');
    // Keep the final 3D stack independent; its last selection stays until a reader clicks a layer.
  }

  function scrolledProgress() {
    if (small()) return percent;
    if (reduced()) return chapter / (N - 1);
    const rect = film.getBoundingClientRect();
    const usable = Math.max(1, film.offsetHeight - window.innerHeight);
    return clamp((-rect.top) / usable);
  }

  function updateFromScroll() {
    pending = 0;
    const t = scrolledProgress();
    sceneProgress(t);
    const nextChapter = Math.round(t * (N - 1));
    if (nextChapter !== chapter) showChapter(nextChapter);
  }

  function onScroll() {
    if (!pending) pending = requestAnimationFrame(updateFromScroll);
  }

  // Keep the clickable Play/Pause control, the Space shortcut, and the live
  // state indicator synchronized. Space must be a tap-to-toggle, not a held key.
  function syncPlaybackControls() {
    const compact = small();
    const accessibleOnly = reduced();
    playButton.textContent = accessibleOnly ? 'View full stack' : compact ? 'Next chapter' :
      isPlaying ? 'Pause journey' : hasPlayed ? 'Resume journey' : 'Play journey';
    playButton.setAttribute('aria-pressed', String(isPlaying));
    playButton.setAttribute('aria-label', isPlaying ? 'Pause the guided journey' :
      compact ? 'Advance to the next journey chapter' : 'Play or resume the guided journey');
    if (playbackStatus) {
      playbackStatus.dataset.state = isPlaying ? 'playing' : hasPlayed ? 'paused' : 'ready';
      playbackStatus.querySelector('.journey-state-text').textContent =
        accessibleOnly ? 'Reduced motion' : compact ? 'Tap a chapter to explore' :
        isPlaying ? 'Playing · Space to pause' : hasPlayed ? 'Paused · Space to resume' : 'Ready · Space to play';
    }
    modeLabel.textContent = isPlaying ? 'GUIDED TOUR · PLAYING' :
      hasPlayed ? 'GUIDED TOUR · PAUSED' : 'SCROLL TO REVEAL · 7 CHAPTERS';
  }

  function cancelTour() {
    isPlaying = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
    syncPlaybackControls();
  }

  let transitionRaf=0;
  function animateLocalChapter(idx){
    if(transitionRaf)cancelAnimationFrame(transitionRaf);
    const from=percent, to=idx/(N-1), start=performance.now(), duration=reduced()?0:450;
    const frame=now=>{
      const t=duration?clamp((now-start)/duration):1;
      const eased=t*t*(3-2*t);
      sceneProgress(from+(to-from)*eased);
      const nearest=Math.round(percent*(N-1));
      if(nearest!==chapter)showChapter(nearest);
      if(t<1){transitionRaf=requestAnimationFrame(frame);}else{transitionRaf=0;showChapter(idx);}
    };
    transitionRaf=requestAnimationFrame(frame);
  }
  function goTo(i, behavior = 'smooth') {
    cancelTour();
    const idx = Math.round(clamp(i, 0, N - 1));
    if (small() || reduced()) {
      animateLocalChapter(idx);
      stage.scrollIntoView({ behavior: reduced() ? 'auto' : behavior, block: 'start' });
    } else {
      const top = window.scrollY + film.getBoundingClientRect().top;
      const usable = Math.max(1, film.offsetHeight - window.innerHeight);
      window.scrollTo({ top: top + usable * idx / (N - 1), behavior: reduced() ? 'auto' : behavior });
    }
  }

  function frame(time) {
    if (!isPlaying) return;
    if (!lastTime) lastTime = time;
    const dt = Math.min(time - lastTime, 70);
    lastTime = time;
    const position = scrolledProgress();
    const nextValue = Math.min(1, position + dt / 25000);
    const filmStart = window.scrollY + film.getBoundingClientRect().top;
    const usable = Math.max(1, film.offsetHeight - window.innerHeight);
    window.scrollTo({ top: filmStart + usable * nextValue, behavior: 'instant' });
    updateFromScroll();
    if (nextValue >= 1) {
      cancelTour();
      status.textContent = 'Journey complete. Your seven-layer experience stack is below.';
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (reduced()) {
      roadmap.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    if (small()) {
      goTo((chapter + 1) % N);
      return;
    }
    if (isPlaying) {
      cancelTour();
      return;
    }
    if (scrolledProgress() > 0.995) goTo(0, 'instant');
    isPlaying = true;
    hasPlayed = true;
    lastTime = 0;
    syncPlaybackControls();
    raf = requestAnimationFrame(frame);
  }

  function replay() {
    goTo(0, reduced() ? 'auto' : 'smooth');
    status.textContent = 'Journey returned to the beginning. Press Play journey to start the guided tour.';
  }

  if ('IntersectionObserver' in window && !reduced()) {
    const assemblyObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        roadmap.classList.add('has-assembled');
        assemblyObserver.disconnect();
      }
    }, { threshold: 0.12 });
    assemblyObserver.observe(roadmap);
  }

  playButton.addEventListener('click', play);
  scrubber.addEventListener('click', evt => {
    const b = evt.target.closest('[data-journey-jump]');
    if (b) goTo(Number(b.dataset.journeyJump));
  });
  prev.addEventListener('click', () => goTo(Math.max(0, chapter - 1)));
  next.addEventListener('click', () => chapter === N - 1 ? roadmap.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }) : goTo(chapter + 1));
  narrative.addEventListener('click', evt => { if (evt.target.closest('.journey-scene-readmore')) selectStack(chapter); });
  skip.addEventListener('click', () => {
    cancelTour();
    selectStack(chapter);
    roadmap.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  });
  section.querySelector('#journey-replay').addEventListener('click', replay);
  stackPreviousButton.addEventListener('click', () => selectStack(stackActive - 1));
  stackNextButton.addEventListener('click', () => selectStack(stackActive + 1));
  stackResetButton.addEventListener('click', () => { peelMode = true; selectStack(0); });
  stackModeButton.addEventListener('click', () => { peelMode = !peelMode; selectStack(stackActive); });
  cards.addEventListener('click', e => {
    const b = e.target.closest('[data-journey-map]');
    if (b && !b.classList.contains('is-removed')) {
      const targetIndex=Number(b.dataset.journeyMap);
      selectStack(peelMode && targetIndex === stackActive && stackActive < N-1 ? stackActive+1 : targetIndex);
    }
  });
  // A single keyboard command path serves both the focused 3D canvas and the
  // ordinary stack controls. The renderer's canvas is focusable, but merely
  // scrolling the stack into view must also make its arrow shortcuts work.
  const stackKeys = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);
  const isTyping = target => Boolean(target?.closest?.(
    'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="slider"],[role="spinbutton"],[role="combobox"]'
  ));
  const hasModifier = event => event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  const chooseStackIndex = key => key === 'Home' ? 0 : key === 'End' ? N - 1 :
    Math.round(clamp(stackActive + (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1), 0, N - 1));
  const stackKeyboardStatus = $('journey-stack-keyboard-status');
  function navigateStackByKey(event, moveFocus = false) {
    if (!stackKeys.has(event.key) || event.defaultPrevented || hasModifier(event) || isTyping(event.target)) return false;
    const i = chooseStackIndex(event.key);
    event.preventDefault();
    if (i !== stackActive) selectStack(i);
    if (stackKeyboardStatus) stackKeyboardStatus.textContent =
      `Layer ${i + 1} of ${N}: ${stackLabels[i]}. ${i === 0 ? 'First chapter.' : i === N - 1 ? 'Final chapter.' : ''}`;
    if (moveFocus) cards.querySelector(`[data-journey-map="${i}"]`)?.focus({preventScroll:true});
    return true;
  }
  // Keyboard users can begin with Tab on the 3D canvas, then use either
  // horizontal or vertical arrows. Prevent the window handler from double-firing.
  cards.addEventListener('keydown', event => {
    if (navigateStackByKey(event, true)) event.stopPropagation();
  });

  const filmVisible = () => {
    const r = film.getBoundingClientRect();
    return r.bottom > innerHeight * .18 && r.top < innerHeight * .82;
  };
  // The middle of the viewport is the user's current reading context.
  // A tall film can remain partly visible near the stack boundary; this
  // explicit stack-first priority prevents the cinematic handler stealing keys.
  const stackInReadingPosition = () => {
    const r = cards.getBoundingClientRect();
    return r.top < innerHeight * .68 && r.bottom > innerHeight * .32;
  };
  const keyboardNavigate = event => {
    if (event.defaultPrevented || hasModifier(event) || isTyping(event.target)) return;
    if (document.querySelector('dialog[open]')) return;
    if (!stackKeys.has(event.key)) return;
    const target = event.target;
    if (target?.closest?.('.project-network,[role="grid"],[role="listbox"],[role="menu"]')) return;
    const inStack = roadmap.contains(target);
    // A visible control elsewhere in the site keeps its own keyboard behavior.
    // Off-screen buttons can retain focus after smooth scrolling, however.
    const outsideControl = !inStack && target?.closest?.('a,button,[role="button"],[role="tab"]');
    if (outsideControl) {
      const r = outsideControl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) return;
    }
    if (inStack || stackInReadingPosition()) {
      navigateStackByKey(event, false);
      return;
    }
    // Outside the stack, retain the existing Left/Right journey navigation.
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !filmVisible()) return;
    event.preventDefault();
    const index = Math.round(percent * (N - 1));
    const targetIndex = Math.round(clamp(index + (event.key === 'ArrowRight' ? 1 : -1), 0, N - 1));
    goTo(targetIndex);
    status.textContent = `Chapter ${targetIndex + 1} of ${N}. Use the left and right arrow keys to navigate.`;
  };
  // A single press of Space pauses or resumes playback. Suppress normal
  // Space-to-scroll behaviour, which used to advance the film after pausing.
  // Do not intercept Space on native interactive controls: focused buttons
  // already activate once on keyup and must not trigger a second toggle.
  const isSpace = event => event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar';
  const interactiveTarget = target => Boolean(target?.closest?.('button,a,summary,[role="button"],[role="tab"],[role="menuitem"]'));
  const handleJourneySpace = event => {
    if (!isSpace(event) || event.repeat || event.defaultPrevented || hasModifier(event) || isTyping(event.target)) return;
    if (document.querySelector('dialog[open]') || interactiveTarget(event.target)) return;
    if (!filmVisible() || stackInReadingPosition() || reduced() || small()) return;
    event.preventDefault();
    play();
    status.textContent = isPlaying ? 'Guided journey playing. Press Space once to pause.' :
      'Journey paused. Press Space once to resume.';
  };
  const cancelOnOtherKey = event => {
    if (!isPlaying || isSpace(event) || event.repeat) return;
    // Native keyboard navigation remains functional without a held Space key.
    cancelTour();
  };
  const cancelOnManualInteraction = () => { if (isPlaying) cancelTour(); };
  const onVisibilityChange = () => { if (document.hidden) cancelTour(); };
  window.addEventListener('keydown', keyboardNavigate);
  window.addEventListener('keydown', handleJourneySpace);
  window.addEventListener('keydown', cancelOnOtherKey);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('wheel', cancelOnManualInteraction, { passive: true });
  window.addEventListener('touchstart', cancelOnManualInteraction, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  selectStack(0);
  showChapter(0);
  sceneProgress(0);
  onScroll();
  syncPlaybackControls();

  return {
    play,
    pause: cancelTour,
    showRoadmap() { roadmap.scrollIntoView({ behavior: 'auto' }); },
    replay,
    select: goTo,
    get state() { return { chapter, running: isPlaying, completed: scrolledProgress() > 0.99 }; },
    destroy() {
      cancelTour();
      window.removeEventListener('keydown', keyboardNavigate);
      window.removeEventListener('keydown', handleJourneySpace);
      window.removeEventListener('keydown', cancelOnOtherKey);
      window.removeEventListener('wheel', cancelOnManualInteraction);
      window.removeEventListener('touchstart', cancelOnManualInteraction);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if(transitionRaf)cancelAnimationFrame(transitionRaf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      stackRenderer.destroy();
      particles.destroy();
    }
  };
}
