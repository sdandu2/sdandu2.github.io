/* M6.61 — responsive navigation: works with keyboard, touch, outside click and hash links. */
const toggle=document.getElementById('mobile-menu-toggle');
const menu=document.getElementById('mobile-site-nav');
if (toggle && menu) {
  const narrow=()=>window.matchMedia('(max-width:900px)').matches;
  const setOpen=(open,{restoreFocus=false}={})=>{
    const active=Boolean(open)&&narrow();
    menu.hidden=!active;
    toggle.setAttribute('aria-expanded',String(active));
    toggle.setAttribute('aria-label',active?'Close navigation menu':'Open navigation menu');
    if (restoreFocus && !active && document.activeElement && menu.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener('click',()=>setOpen(menu.hidden));
  menu.addEventListener('click',(event)=>{
    if (event.target.closest('a[href^="#"]'))setOpen(false);
  });
  document.addEventListener('keydown',(event)=>{
    if (event.key==='Escape' && !menu.hidden) {
      event.preventDefault();setOpen(false,{restoreFocus:true});toggle.focus();
    }
  });
  document.addEventListener('pointerdown',(event)=>{
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target))setOpen(false);
  });
  window.addEventListener('hashchange',()=>setOpen(false));
  window.addEventListener('resize',()=>{if(!narrow())setOpen(false);});
  setOpen(false);
}
