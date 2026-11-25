/** M6.56: navigation appears only when the actual network is horizontally clipped.
 * It is independent from breakpoint guesses and remains hidden for the mobile
 * list fallback where the wide canvas itself is not displayed.
 */
const viewport = document.getElementById('skill-atlas-viewport');
const nav = document.getElementById('skill-scroll-nav');
const prev = document.getElementById('skill-scroll-previous');
const next = document.getElementById('skill-scroll-next');
const canvas = document.querySelector('#engine .skill-atlas-canvas');

if (viewport && nav && prev && next && canvas) {
  const epsilon = 3;
  const isVisible = () => {
    const cs = getComputedStyle(viewport);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && viewport.getClientRects().length > 0;
  };
  function refresh() {
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const needsScroll = isVisible() && max > epsilon;
    nav.hidden = !needsScroll;
    nav.dataset.overflow = String(needsScroll);
    if (!needsScroll) {
      prev.disabled = true;
      next.disabled = true;
      return;
    }
    prev.disabled = viewport.scrollLeft <= epsilon;
    next.disabled = viewport.scrollLeft >= max - epsilon;
  }
  function move(direction) {
    if (nav.hidden) return;
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const travel = Math.max(250, Math.round(viewport.clientWidth * .72));
    const dest = Math.min(max, Math.max(0, viewport.scrollLeft + direction * travel));
    viewport.scrollTo({left: dest, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewport.addEventListener('scroll', refresh, {passive:true});
  window.addEventListener('resize', refresh, {passive:true});
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(refresh) : null;
  ro?.observe(viewport);
  ro?.observe(canvas);
  // The graph renders in another ES module: recheck after its initial draw.
  requestAnimationFrame(refresh);
  window.addEventListener('load', refresh, {once:true});
  document.addEventListener('visibilitychange', () => {if (!document.hidden) refresh();});
}
