/** M6.57: A real horizontal scrollbar, visible only when the graph overflows.
 * Both the native scrollbar and the graph viewport retain mouse/keyboard/trackpad access.
 */
const viewport = document.getElementById('skill-atlas-viewport');
const rail = document.getElementById('skill-scroll-rail');
const spacer = document.getElementById('skill-scroll-spacer');
const canvas = document.querySelector('#engine .skill-atlas-canvas');
if (viewport && rail && spacer && canvas) {
  const EPSILON = 3;
  const graphIsVisible = () => {
    const style = getComputedStyle(viewport);
    return style.display !== 'none' && style.visibility !== 'hidden' && viewport.getClientRects().length > 0;
  };
  function refresh() {
    const contentWidth = Math.max(canvas.scrollWidth, viewport.scrollWidth);
    const overflow = graphIsVisible() && contentWidth - viewport.clientWidth > EPSILON;
    // The spacer gives the upper track precisely the same scroll range as the graph.
    spacer.style.width = `${contentWidth}px`;
    rail.hidden = !overflow;
    if (overflow && Math.abs(rail.scrollLeft - viewport.scrollLeft) > .5) {
      rail.scrollLeft = viewport.scrollLeft;
    }
  }
  rail.addEventListener('scroll', () => {
    if (!rail.hidden && Math.abs(rail.scrollLeft - viewport.scrollLeft) > .5)
      viewport.scrollLeft = rail.scrollLeft;
  }, {passive: true});
  viewport.addEventListener('scroll', () => {
    if (!rail.hidden && Math.abs(rail.scrollLeft - viewport.scrollLeft) > .5)
      rail.scrollLeft = viewport.scrollLeft;
  }, {passive: true});
  window.addEventListener('resize', refresh, {passive:true});
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(refresh) : null;
  ro?.observe(viewport);
  ro?.observe(canvas);
  requestAnimationFrame(refresh);
  window.addEventListener('load', refresh, {once:true});
  document.fonts?.ready?.then(refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
}
