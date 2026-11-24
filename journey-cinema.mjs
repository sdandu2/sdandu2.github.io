// Milestone 6.12 — editorial, event-to-event art direction for the career film.
// The images are editorial illustrations, not photographs from the internships.
// Existing proof screenshots are preserved in the separate project network.
const esc = v => String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));

const chartSVG = `<svg class="cinema-data-graph" viewBox="0 0 600 220" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="graphLine" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#5d95ec"/><stop offset=".52" stop-color="#8fdfff"/><stop offset="1" stop-color="#76e6d3"/></linearGradient><linearGradient id="graphArea" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#56bff3" stop-opacity=".34"/><stop offset="1" stop-color="#56bff3" stop-opacity="0"/></linearGradient></defs><g stroke="#a6e1ff" stroke-opacity=".12">${[1,2,3,4].map(i=>`<path d="M14 ${i*41}H587"/>`).join('')}${[1,2,3,4,5,6,7].map(i=>`<path d="M${i*75} 12V206"/>`).join('')}</g><path d="M14 180 C85 172 97 82 161 109 S262 182 325 123 S412 53 472 89 S546 56 587 47 L587 207 H14Z" fill="url(#graphArea)"/><path d="M14 180 C85 172 97 82 161 109 S262 182 325 123 S412 53 472 89 S546 56 587 47" stroke="url(#graphLine)" stroke-width="3.3" fill="none" stroke-linecap="round"/><circle cx="472" cy="89" r="6" fill="#b9faff"/><circle cx="472" cy="89" r="15" fill="none" stroke="#92e6ff" stroke-opacity=".4"/></svg>`;

const robotSVG = `<svg viewBox="0 0 740 345" class="cinema-robot-map" aria-hidden="true"><defs><pattern id="robGrid" width="37" height="37" patternUnits="userSpaceOnUse"><path d="M 37 0 L 0 0 0 37" fill="none" stroke="#6cbce9" stroke-opacity=".16" stroke-width="1"/></pattern><radialGradient id="robotGlow"><stop stop-color="#7de4ff" stop-opacity=".32"/><stop offset="1" stop-color="#7de4ff" stop-opacity="0"/></radialGradient></defs><rect width="740" height="345" fill="url(#robGrid)"/><rect x="155" y="70" width="106" height="73" rx="6" fill="#1e4160" stroke="#83bedd" stroke-opacity=".7"/><rect x="385" y="197" width="142" height="85" rx="6" fill="#1e4160" stroke="#83bedd" stroke-opacity=".7"/><rect x="565" y="63" width="70" height="90" rx="6" fill="#1e4160" stroke="#83bedd" stroke-opacity=".7"/><path d="M90 282 C158 250 226 259 292 204 S387 113 471 142 S552 107 645 55" fill="none" stroke="#9eeafa" stroke-width="3" stroke-dasharray="12 13" stroke-linecap="round"/><g transform="translate(292 204)">${Array.from({length:22},(_,i)=>{let a=i*Math.PI/11;return `<line x1="0" y1="0" x2="${Math.cos(a)*144}" y2="${Math.sin(a)*144}" stroke="#7cd6fa" stroke-opacity=".18"/>`;}).join('')}<circle r="110" fill="url(#robotGlow)"/><circle r="29" fill="#0b3c5d" stroke="#c3efff" stroke-width="3"/><path d="M-7 7L14 0L-7 -7Z" fill="#defaff"/><circle r="5" fill="#c9f9ff"/></g><circle cx="645" cy="55" r="11" fill="#a7e8f8"/><circle cx="645" cy="55" r="22" fill="none" stroke="#a7e8f8" stroke-opacity=".6"/></svg>`;

// Cinematic editorial imagery rather than internship statistics or resume-style charts.
// The generated assets illustrate subject matter; they are not actual internship photographs.
const scenicMoments = [
  // Editorial sources are intentionally distinct from the author's own project evidence.
  { image:'https://today.uic.edu/wp-content/uploads/2015/11/uic.jpg', fallback:'assets/journey/campus-concept.webp', detail:'assets/journey/uic-data.webp', label:'UNIVERSITY OF ILLINOIS CHICAGO', theme:'Campus / exploring data', accent:'campus', tag:'01 — FOUNDATIONS' },
  { image:'assets/journey/ensar-logo.webp', detail:'assets/journey/ensar-classifier.webp', label:'ENSAR SOLUTIONS', theme:'Industry / image classification', accent:'ensar', tag:'02 — FIRST INTERNSHIP' },
  { image:'https://www.komatsu.jp/ja/-/media/home/newsroom/2021/0910/komatsu-pc7000-june-2021.jpg?h=480&hash=275B085BE6B29A88062EEB7A194A1346&rev=-1&w=720', fallback:'assets/journey/industrial.webp', detail:'assets/journey/komatsu-smart-construction.webp', label:'KOMATSU NORTH AMERICA', theme:'Industrial systems / connected data', accent:'komatsu', tag:'03 — OPERATIONS' },
  { image:'https://www.cs.umd.edu/sites/default/files/images/article/2024/IribeCenter_03122019_8003-by%20John%20T.%20Consoli.jpg', fallback:'assets/journey/research.webp', detail:'assets/journey/umd-machine-learning.webp', label:'BRENDAN IRIBE CENTER · UMD', theme:'Graduate study / deeper ML questions', accent:'umd', tag:'04 — RESEARCH' },
  { image:'assets/journey/teckpulse-banner.webp', detail:'https://foto.wuestenigel.com/photos/full/rechenzentrum-mit-nvidia-geforce-rtx-gpu-servern.jpg', detailFallback:'assets/journey/teckpulse-compute-fallback.webp', label:'TECKPULSE', theme:'Training infrastructure / faster iteration', accent:'teckpulse', tag:'05 — ML ENGINEERING' },
  { image:'assets/journey/independent-systems.webp', detail:'assets/simshift-cinematic.webp', label:'INDEPENDENT ENGINEERING', theme:'Systems / retrieval / simulated networks', accent:'projects', tag:'06 — BUILDING' },
  { image:'assets/journey/robotics-navigation.webp', detail:'https://www.clarkconstruction.com/sites/default/files/styles/gallery_image/public/2026-03/GMU%20Robots.jpg?itok=iXd5RzBi', detailFallback:null, label:'ROBOTICS EXPLORATION', theme:'Learning navigation / robot teams', accent:'robotics', tag:'07 — WHAT’S NEXT' }
];

// Milestone 6.33 — screen-only copy for the cinematic slideshow.
// Full Career Journey chapters retain their original wording and dates.
export const cinemaChapterCopy = [
  { phase: '01 / THE BEGINNING' },
  { phase: '02 / THE START OF MY INDUSTRY EXPERIENCE' },
  { phase: '03 / OPERATIONAL IMPACT' },
  { phase: '04 / DEEPER QUESTIONS' },
  { phase: '05 / SOFTWARE ENGINEERING + ML' },
  { phase: '06 / BUILDING MY PORTFOLIO' },
  {
    phase: '07 / THE NEXT STEP',
    place: 'Quantum Computing · Robotics',
    title: 'Following my curiosity into quantum computing and robotics',
    description: 'Recently, I’ve been exploring quantum computing and robotics. Simulated circuits and robot navigation have both given me new questions to investigate.'
  }
];

function art(i) {
  const a = scenicMoments[i];
  return `<div class="cinema-editorial cinema-editorial-${i} cinema-theme-${a.accent}">
    <div class="cinema-editorial-ring ring-one"></div>
    <div class="cinema-editorial-ring ring-two"></div>
    <figure class="cinema-editorial-primary">
      <img src="${esc(a.image)}" ${a.fallback ? `data-journey-fallback="${esc(a.fallback)}"` : ''} alt="" ${i > 1 ? 'loading="lazy"' : ''} decoding="async">
    </figure>
    <figure class="cinema-editorial-secondary" aria-hidden="true">
      <img src="${esc(a.detail)}" ${a.detailFallback ? `data-journey-fallback="${esc(a.detailFallback)}"` : ''} alt="" loading="lazy" decoding="async">
    </figure>
  </div>`;
}

export { scenicMoments };

export function cinemaMarkup(chapters) {
 return `<div class="cinema-environment" aria-hidden="true"><div class="cinema-halo halo-one"></div><div class="cinema-halo halo-two"></div><div class="cinema-orbit orbit-one"></div><div class="cinema-orbit orbit-two"></div></div>
  <canvas class="cinema-particle-field" id="cinema-particle-field" aria-hidden="true"></canvas>
  <div class="cinema-moments">${chapters.map((c,i)=>`<div class="cinema-moment" data-journey-motif="${i}" style="--chapter-accent:${c.tone}" aria-hidden="${i!==0}"><div class="cinema-moment-art">${art(i)}</div></div>`).join('')}</div>`;
}

// Deterministic formations: no literal career-path or travel trajectory.
function formation(style,count) {
 const out=[];
 for(let j=0;j<count;j++){
  const a=j*2.39996323, rr=Math.sqrt((j+.5)/count), u=(j+.5)/count, ring=Math.floor(j/20);
  let x=0,y=0,z=0;
  if(style===0){x=.55*rr*Math.cos(a);y=.42*rr*Math.sin(a);z=.2*Math.sin(j*1.3);}
  if(style===1){x=((j%23)/22-.5)*1.45;y=(Math.floor(j/23)/Math.ceil(count/23)-.5)*1.1;z=.22*Math.sin(j*1.1);}
  if(style===2){x=.72*(u-.5)*2;y=(j%5-2)*.115+.045*Math.sin(j*.25);z=.16*Math.sin(j*.2);}
  if(style===3){x=(.4+.21*Math.sin(j*.55))*Math.cos(a);y=(.35+.14*Math.sin(j*.35))*Math.sin(a);z=.3*Math.cos(j*.1);}
  if(style===4){x=1.3*(u-.5);y=(j%9-4)*.09;z=.2*Math.cos(j*.3);}
  if(style===5){x=.76*rr*Math.cos(a);y=.44*rr*Math.sin(a);z=.35*Math.sin(a*3);}
  if(style===6){x=(.25+rr*.55)*Math.cos(a);y=(.25+rr*.55)*Math.sin(a)*.65;z=.25*Math.cos(j*.43);}
  out.push({x,y,z});
 }
 return out;
}

export function mountParticleField(canvas, getProgress) {
 if(!canvas) return {destroy(){}};
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx) return {destroy(){}};
 let visible=false, raf=0, w=1000, h=600, dpr=1, tick=0;
 let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const n=matchMedia('(max-width: 700px)').matches?80:195;
 const formations=Array.from({length:7},(_,i)=>formation(i,n));
 let observer;
 function resize(){const b=canvas.getBoundingClientRect();w=Math.max(1,b.width);h=Math.max(1,b.height);dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 function draw(t){
  tick=t*.001;ctx.clearRect(0,0,w,h);
  const story=getProgress()*6, k=Math.min(5,Math.floor(story)), blend=story-k, ease=blend*blend*(3-2*blend);
  // Keep particle field subtle and to the edges so the scene itself stays readable.
  const cx=w*.5,cy=h*.37, spread=Math.min(w*.47,h*.55);
  for(let i=0;i<n;i++){
   const a=formations[k][i], b=formations[k+1]?.[i]||a;
   const x=a.x+(b.x-a.x)*ease, y=a.y+(b.y-a.y)*ease, z=a.z+(b.z-a.z)*ease;
   const slow=reduced?0:Math.sin(tick*.52+i*1.31)*.018;
   const xx=cx+(x+slow)*spread, yy=cy+(y+slow*.6)*spread;
   const size=(.65+z*.65)*(i%13===0?2.4:1.25);
   ctx.fillStyle=`rgba(${i%5===0?'145,232,246':'97,165,219'},${(.16+(z+.5)*.18).toFixed(3)})`;
   ctx.beginPath();ctx.arc(xx,yy,Math.max(.5,size),0,Math.PI*2);ctx.fill();
  }
 }
 function frame(t){if(!visible)return;draw(t);if(!reduced)raf=requestAnimationFrame(frame)}
 function start(){if(visible)return;visible=true;resize();raf=requestAnimationFrame(frame)}
 function stop(){visible=false;cancelAnimationFrame(raf)}
 observer=new IntersectionObserver(es=>{if(es[0]?.isIntersecting)start();else stop()},{rootMargin:'100px'});
 observer.observe(canvas);
 const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;ro?.observe(canvas);
 return {redraw:()=>draw(performance.now()),destroy(){stop();observer.disconnect();ro?.disconnect()}};
}
