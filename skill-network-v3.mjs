/** M6.49 · Project-only detail reader, forward-only skill traces, original project imagery.
 * No floating previews: hover previews only graph relationships, click pins a selection.
 * Existing editorial images live solely in the detail reader below the network.
 *
 * Eight-layer evidence pathways.
 * Every line crosses one and only one category boundary, and is scoped to
 * one or more projects documented by the source catalog.
 */
import {projects} from './data.mjs';
import {insights,financeNotes} from './insights.mjs';
import {skillNodes,skillLinks,skillsById,visualColumns,skillGraphStats,projectIds,anchors} from './skill-network-traces.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const grouped=visualColumns.map(c=>skillNodes.filter(n=>n.visualColumn===c.id));
const maxRows=Math.max(...grouped.map(g=>g.length));
const projectMap=new Map(projects.map(p=>[p.id,p]));
const edgeId=e=>`${e.from}|${e.to}`;
const imageFigure=(p,extraClass='')=>p?.image?`<figure class="skill-v46-project-art ${extraClass}"><img src="${esc(p.image)}" alt="${esc(p.imageLabel||`Visual overview of ${p.name}`)}" loading="lazy" decoding="async"><figcaption>${esc(p.imageLabel||`Existing project artwork for ${p.name}`)}</figcaption></figure>`:'';
const inlineNotes=p=>{
 const n=p.id==='financialscenarios'?financeNotes:insights[p.id];
 if(!n)return '';
 const fields=[['Question',n.question],['What I built',n.built],['Why this approach',n.choice],['What the evidence supports',n.evidence]];
 return `<details class="skill-v46-notes"><summary>Read engineering notes</summary><div class="skill-v46-notes-content"><div class="skill-v46-notes-grid">${fields.map(([heading,body])=>`<div><strong>${esc(heading)}</strong><p>${esc(body)}</p></div>`).join('')}</div><p class="skill-v46-notes-limit"><strong>Limitations:</strong> ${esc(n.limitation)}</p>${n.proof?`<figure class="skill-v46-notes-proof"><img src="${esc(n.proof)}" alt="Existing supporting visual for ${esc(p.name)}" loading="lazy" decoding="async"><figcaption>Previously included project visual</figcaption></figure>`:''}</div></details>`;
};
const galleryCard=p=>`<button type="button" class="skill-v46-gallery-card" data-skill-id="${esc(p.id)}" aria-label="Explore ${esc(p.name)} and its connected skills"><img src="${esc(p.image)}" alt="" loading="lazy" decoding="async"><span>${esc(p.name)}</span></button>`;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const kindTag=n=>n.column==='projects'?'PROJECT':n.kind==='foundational'?'FOUNDATION':'PROJECT-SUPPORTED';
const nodeMeaning=n=>n.kind==='foundational'?'Related mathematical or engineering foundation.':n.column==='projects'?'Portfolio project.':'Supported in the named project work.';

function pathToSkill(project,target){
 if(project===target)return [];
 const outgoing=new Map();
 for(const e of skillLinks){if(!e.projects.includes(project))continue;
  if(!outgoing.has(e.from))outgoing.set(e.from,[]);outgoing.get(e.from).push(e);
 }
 const paths=[[project,[]]];const seen=new Set([project]);
 while(paths.length){
  const [at,steps]=paths.shift();
  for(const e of outgoing.get(at)||[]){
   if(seen.has(e.to))continue;
   const next=[...steps,edgeId(e)];
   if(e.to===target)return next;
   seen.add(e.to);paths.push([e.to,next]);
  }
 }
 return [];
}

export function mountSkillNetwork({onShowNotes}={}){
 const module=document.querySelector('#engine .skill-atlas-module');
 const viewport=document.getElementById('skill-atlas-viewport');
 const canvas=document.querySelector('#engine .skill-atlas-canvas');
 const columns=document.getElementById('skill-atlas-columns');
 const stage=document.getElementById('project-graphic');
 const svg=document.getElementById('project-connections');
 const detail=document.getElementById('project-focus');
 const mobile=document.getElementById('project-mobile');
 const clear=document.getElementById('skill-clear-selection');
 const motion=document.getElementById('project-motion-toggle');
 const evidenceButton=document.getElementById('skill-view-evidence');
 const readout=document.getElementById('project-signal-readout');
 if([module,viewport,canvas,columns,stage,svg,detail,mobile,clear,motion,evidenceButton,readout].some(x=>!x))return null;
 let selected=null,hovered=null,playing=!reduced(),mounted=true;
 let coords=new Map(),width=0,activePaths=new Set();
 const topInset=105,rowPitch=83,cardHeight=62,bottomInset=36;
 const height=topInset+(maxRows-1)*rowPitch+cardHeight+bottomInset;
 const weights=[1.04,1.09,1.3,1.4,1.22,.89,1.15,1.17];
 const sum=weights.reduce((a,b)=>a+b,0);
 const notifyFocus=()=>{
  const el=detail.querySelector('#skill-detail-title');
  el?.focus({preventScroll:true});
  detail.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
 };
 function draw(){
  if(!mounted)return;
  width=Math.max(2020,Math.round(viewport.clientWidth||0));
  let x=0;const sizes=weights.map(v=>width*v/sum);
  const starts=sizes.map(v=>{const old=x;x+=v;return old;});
  const dim=`${height}px`;for(const el of [canvas,columns,stage,svg]){el.style.width=`${width}px`;el.style.height=dim;}
  viewport.style.setProperty('--graph-height',dim);viewport.style.height=dim;
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  columns.innerHTML=visualColumns.map((c,i)=>`<div class="skill-column" style="left:${(starts[i]+2).toFixed(2)}px;width:${(sizes[i]-4).toFixed(2)}px;height:${height-14}px"><span>${String(i+1).padStart(2,'0')} / ${esc(c.label)}</span><small>${esc(c.note)}</small></div>`).join('');
  coords=new Map();const cards=[];
  for(let i=0;i<grouped.length;i++){
   const pad=Math.max(24,Math.min(34,sizes[i]*.115));
   const w=sizes[i]-2*pad;
   grouped[i].forEach((n,j)=>{
    const pos={x:starts[i]+pad,y:topInset+j*rowPitch,w,h:cardHeight,layer:i};coords.set(n.id,pos);
    cards.push(`<button type="button" class="skill-node skill-v3-node skill-v3-${n.kind}" data-skill-id="${esc(n.id)}" aria-pressed="false" style="left:${pos.x.toFixed(2)}px;top:${pos.y.toFixed(2)}px;width:${pos.w.toFixed(2)}px"><span class="skill-v3-beacon" aria-hidden="true"></span><span class="skill-v3-label">${esc(n.title)}</span><small>${kindTag(n)}</small></button>`);
   });
  }
  stage.innerHTML=cards.join('');
  // SVG is always behind the cards, but over the column backplates.
  // Each line crosses a SINGLE boundary and terminates on the actual vertical
  // center of its target. There are no cross-column jumps or fabricated edges.
  const lines=skillLinks.map((e,i)=>{
   const a=coords.get(e.from),b=coords.get(e.to);
   const ax=a.x+a.w,ay=a.y,bx=b.x,by=b.y;
   const gap=bx-ax,c=Math.max(18,Math.min(75,gap*.46));
   const d=`M${ax.toFixed(2)} ${ay.toFixed(2)} C${(ax+c).toFixed(2)} ${ay.toFixed(2)}, ${(bx-c).toFixed(2)} ${by.toFixed(2)}, ${bx.toFixed(2)} ${by.toFixed(2)}`;
   const duration=(6.2+(i%7)*.23).toFixed(2);
   return `<g class="skill-v3-connection skill-v45-edge ${i%4===0?'is-ambient':''}" data-edge="${esc(edgeId(e))}" data-projects="${esc(e.projects.join(','))}" style="--signal-duration:${duration}s;--signal-delay:${(-i*.29).toFixed(2)}s"><path class="skill-v42-wire-border" d="${d}"/><path class="skill-v3-wire" d="${d}"/><path class="skill-v3-signal" pathLength="100" d="${d}"/></g>`;
  });
  svg.innerHTML=`<g class="skill-v3-wires">${lines.join('')}</g><g class="skill-v42-focus-layer" aria-hidden="true"></g>`;
  module.dataset.totalTopics=String(skillNodes.length);
  module.dataset.totalConnections=String(skillLinks.length);
  module.dataset.graphHeight=String(height);
  module.dataset.graphWidth=String(width);
  module.dataset.visualColumns='8';
  module.dataset.projectCoverage='7';
  module.dataset.skillsWithProjects=String(skillNodes.filter(n=>n.projects.length>0).length);
  mobile.innerHTML=visualColumns.map((c,i)=>`<section class="skill-v3-mobile-group"><h3>${String(i+1).padStart(2,'0')} / ${esc(c.label)}</h3><div>${grouped[i].map(n=>`<button type="button" data-skill-id="${esc(n.id)}" aria-pressed="false"><span>${esc(n.title)}</span><small>${esc(nodeMeaning(n))}</small></button>`).join('')}</div></section>`).join('');
  highlight();
 }
 function highlight(){
  const id=hovered||selected;const target=skillsById.get(id);
  const targetLayer=target?visualColumns.findIndex(c=>c.id===target.visualColumn):0;
  const traced=new Set();const lit=new Set();const pSet=new Set();
  if(target){
   if(target.column==='projects'){
    pSet.add(target.id);for(const e of skillLinks)if(e.projects.includes(target.id))traced.add(edgeId(e));
   }else{
    // Skills illuminate only what is to their RIGHT. Confirm project
    // provenance first, then follow that SAME project's outgoing links.
    for(const p of target.projects){
     const route=pathToSkill(p,target.id);
     if(!route.length)continue;
     pSet.add(p);
     const frontier=[target.id],seen=new Set(frontier);
     while(frontier.length){
      const from=frontier.shift();
      for(const e of skillLinks){
       if(e.from!==from||!e.projects.includes(p))continue;
       traced.add(edgeId(e));
       if(!seen.has(e.to)){seen.add(e.to);frontier.push(e.to);}
      }
     }
    }
   }
   for(const key of traced){const [a,b]=key.split('|');lit.add(a);lit.add(b);}
   lit.add(target.id);
  }
  activePaths=traced;
  const overlay=svg.querySelector('.skill-v42-focus-layer');
  if(overlay){
   // Bright paths get their own SVG layer so dark crossing wires don't hide them.
   overlay.innerHTML=[...traced].map((key,i)=>{
    const el=[...svg.querySelectorAll('.skill-v3-wires [data-edge]')].find(x=>x.dataset.edge===key);
    const d=el?.querySelector('.skill-v3-wire')?.getAttribute('d');if(!d)return '';
    return `<g class="skill-v42-focus-edge" data-trace-edge="${esc(key)}" style="--flow-delay:${(skillsById.get(key.split('|')[0])?Math.max(0,visualColumns.findIndex(c=>c.id===skillsById.get(key.split('|')[0]).visualColumn)-targetLayer)*.48:0).toFixed(2)}s"><path class="skill-v42-focus-back" d="${d}"/><path class="skill-v42-focus-front" d="${d}"/><path class="skill-v42-focus-pulse" pathLength="100" d="${d}"/></g>`;
   }).join('');
  }
  module.classList.toggle('skill-v41-node-active',!!target);
  module.classList.toggle('skill-v42-focus-visible',traced.size>0);
  module.classList.toggle('skill-v3-paused',!playing||reduced());
  module.dataset.tracedProject=target?.column==='projects'?target.id:'';
  module.dataset.tracedConnections=String(traced.size);
  module.dataset.tracedLayers=target?String(new Set([target.id,...[...traced].flatMap(k=>k.split('|'))].map(n=>skillsById.get(n).visualColumn)).size):'0';
  module.dataset.traceDirection=target?.column==='projects'?'project':'forward';
  module.dataset.selectedSkill=selected||'';
  module.dataset.hoverSkill=hovered||'';
  for(const el of stage.querySelectorAll('[data-skill-id]')){
   const n=el.dataset.skillId;
   el.classList.toggle('is-selected',n===selected);
   el.classList.toggle('is-related',!!target&&lit.has(n));
   el.classList.toggle('is-muted',!!target&&!lit.has(n));
   el.setAttribute('aria-pressed',String(n===selected));
  }
  for(const el of mobile.querySelectorAll('[data-skill-id]'))el.setAttribute('aria-pressed',String(el.dataset.skillId===selected));
  for(const el of svg.querySelectorAll('.skill-v3-wires [data-edge]')){
   const on=traced.has(el.dataset.edge);
   el.classList.toggle('is-related',on);
   el.classList.toggle('is-muted',!!target&&!on);
  }
  clear.disabled=!selected;
  evidenceButton.hidden=target?.column!=='projects';
  evidenceButton.textContent='View project ↓';
  motion.disabled=reduced();motion.textContent=playing&&!reduced()?'Pause signals':'Play signals';
  motion.setAttribute('aria-pressed',String(playing&&!reduced()));
  readout.textContent=target?(target.column==='projects'?`${target.title} · ${traced.size} links through all eight layers`:(traced.size?`${target.title} → ${traced.size} downstream links to the right`:`${target.title} · final layer · supported by ${pSet.size} projects`)):`${projectIds.length} projects · 8 connected layers · ${skillGraphStats.connections} links`;
 }
 function renderDetails(){
  const node=skillsById.get(selected);
  // Only project nodes own written explanations. Skills are explored directly
  // through their highlighted rightward paths within the graph.
  if(!node||node.column!=='projects'){
   detail.innerHTML=`<div class="skill-v49-gallery-intro"><p class="skill-detail-kicker">PROJECT BREAKDOWNS</p><h3 id="skill-detail-title" tabindex="-1">Explore the projects.</h3><p class="network-focus-copy">Choose a project in the network or select one of the images below to read about the work, see the original artwork, and explore the implementation.</p></div><div class="skill-v46-gallery-heading"><strong>SEVEN PROJECTS</strong><span>Select a project to read its breakdown</span></div><div class="skill-v46-gallery">${projects.map(galleryCard).join('')}</div>`;
   return;
  }
  const project=projectMap.get(node.id);
  if(!project)return;
  detail.innerHTML=`<div class="skill-detail-heading"><div><p class="skill-detail-kicker">PROJECT BREAKDOWN</p><h3 id="skill-detail-title" tabindex="-1">${esc(project.name)}</h3></div><div class="skill-detail-controls"><button type="button" data-back-to-network>Back to network</button><button type="button" data-skill-clear>All projects</button></div></div><div class="skill-v46-project-lead skill-v49-project-only"><div class="skill-v46-project-copy"><p class="skill-v46-eyebrow">ABOUT THIS PROJECT</p><p class="skill-v46-full-description">${esc(project.description)}</p>${node.project?`<div class="network-focus-result network-focus-result-compact"><strong>${esc(node.project.result)}</strong><span>${esc(node.project.resultLabel)}</span></div>`:''}<div class="project-network-actions">${project.repo?`<a href="${esc(project.repo)}" target="_blank" rel="noopener noreferrer">View repository</a>`:''}</div>${inlineNotes(project)}</div>${imageFigure(project,'skill-v46-hero-art')}</div>`;
 }

 function pick(id,{scrollToDetail}={}){
  if(!skillsById.has(id))return;
  selected=id;hovered=null;highlight();renderDetails();
  // A skill click stays in the graph; project detail is reserved for projects.
  const shouldScroll=(scrollToDetail??false)&&skillsById.get(id)?.column==='projects';
  if(shouldScroll)notifyFocus();
 }
 function clearSelection(){selected=null;hovered=null;highlight();renderDetails();}
 const onStageClick=e=>{const b=e.target.closest('[data-skill-id]');if(b)pick(b.dataset.skillId);};
 stage.addEventListener('click',onStageClick);
 const onHover=e=>{const b=e.target.closest('[data-skill-id]');if(b&&b.dataset.skillId!==hovered){hovered=b.dataset.skillId;highlight();}};
 stage.addEventListener('pointerover',onHover);
 stage.addEventListener('pointerout',e=>{const b=e.target.closest('[data-skill-id]');if(b&&!b.contains(e.relatedTarget)){hovered=null;highlight();}});
 stage.addEventListener('focusin',onHover);
 stage.addEventListener('focusout',e=>{if(e.target.closest('[data-skill-id]')){hovered=null;highlight();}});
 mobile.addEventListener('click',e=>{const b=e.target.closest('[data-skill-id]');if(b)pick(b.dataset.skillId,{scrollToDetail:false});});
 clear.addEventListener('click',clearSelection);
 evidenceButton.addEventListener('click',notifyFocus);
 motion.addEventListener('click',()=>{playing=!playing;highlight();});
 detail.addEventListener('click',e=>{
  const b=e.target.closest('[data-skill-id]');if(b){pick(b.dataset.skillId,{scrollToDetail:true});return;}
  if(e.target.closest('[data-skill-clear]')){clearSelection();return;}
  if(e.target.closest('[data-back-to-network]')){viewport.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});return;}
 });
 const key=e=>{if(e.key==='Escape'&&selected&&!e.target.matches('input,textarea,select,[contenteditable]'))clearSelection();};
 document.addEventListener('keydown',key);
 const ro=new ResizeObserver(entries=>{
  const current=Math.round(entries[0]?.contentRect.width||0);
  if(mounted&&current&&Math.abs(Math.max(2020,current)-width)>3)draw();
 });
 ro.observe(viewport);
 draw();renderDetails();
 return {focus:pick,showAll:clearSelection,destroy(){mounted=false;ro.disconnect();document.removeEventListener('keydown',key);}};
}
