/** Milestone 6.25: the approved six-column graph, sized to fit without horizontal scrolling.
 * The entire role-skill inventory remains searchable in the evidence panel; only
 * directly documented project links are drawn. Foundation and exploratory nodes
 * are visually distinct and never acquire invented portfolio evidence.
 */
import {projects} from './data.mjs';
import {skillNodes,skillColumns,skillLinks,skillsById,skillTracks} from './skill-network-data.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columns=skillColumns.map(c=>c.id);
const pathsByProject=new Map();
for(const p of projects)pathsByProject.set(p.id,skillNodes.filter(n=>n.projects.includes(p.id)));
const categories={documented:'Project-backed',foundational:'Foundational context',explore:'To explore'};
const trackPicks={
 software:{
  domains:['systems','backend-systems','frontend-systems','fullstack','data-engineering','ml-eval','production-reliability'],
  methods:['benchmark','deterministic-testing','data-pipelines','api-engineering','rest-apis','integration-testing','data-structures','concurrency'],
  math:['complexity','performance-measurement','throughput','latency','statistics','probability','optimization-math','recursion'],
  tools:['python','cpp','typescript','sql','react','fastapi','postgres','docker'],
  practices:['reproducibility','debugging','testing','documentation','requirements','code-review','tradeoffs','observability']
 },
 ml:{
  domains:['vision','retrieval','ml-eval','deep-learning','data-engineering','fullstack','quantum-net'],
  methods:['anomaly','patchcore','classification','semantic-search','data-pipelines','search-ranking','controlled-experiments','model-serving'],
  math:['linear-algebra','probability','statistics','auroc','ndcg','uncertainty','time-series','mae'],
  tools:['python','pytorch','dinov2','fastapi','react','postgres','docker','sklearn'],
  practices:['experiment-design','reproducibility','debugging','evaluation-rigor','testing','research-synthesis','documentation']
 },
 quantum:{
  domains:['quantum-sim','quantum-net','ml-eval','deep-learning'],
  methods:['qaoa','quantum-noise','circuit-design','variational','simulation','benchmark','optimization','forecasting'],
  math:['linear-algebra','probability','optimization-math','maxcut','gate-budget','matrix-algebra','complex-vectors','mae'],
  tools:['python','qiskit','qiskit-aer','pytorch','numpy','notebooks','pennylane','cirq'],
  practices:['experiment-design','reproducibility','evaluation-rigor','tradeoffs','documentation','research-synthesis']
 },
 quant:{
  domains:['systems','quant-finance','data-engineering','ml-eval'],
  methods:['order-matching','benchmark','deterministic-testing','forecasting','scenario-gen','simulation','backtesting','signal-eval'],
  math:['probability','statistics','optimization-math','time-series','throughput','uncertainty','risk','stochastic'],
  tools:['python','cpp','sql','numpy','pandas','postgres','notebooks','cmake'],
  practices:['tradeoffs','reproducibility','evaluation-rigor','debugging','communication','documentation','testing']
 }
};
const softwareFocusPicks={
 backend:{
  domains:['backend-systems','fullstack','data-engineering','systems','retrieval','ml-eval','production-reliability'],
  methods:['rest-apis','api-engineering','integration-testing','data-pipelines','database-design','sql-optimization','error-handling','http-fundamentals'],
  math:['time-counts','throughput','performance-measurement','complexity','statistics','probability','latency','recursion'],
  tools:['python','fastapi','postgres','sql','docker','typescript','react','git'],
  practices:['testing','debugging','documentation','requirements','tradeoffs','reproducibility','code-review','observability']
 },
 systems:{
  domains:['systems','backend-systems','data-engineering','ml-eval','production-reliability'],
  methods:['benchmark','order-matching','deterministic-testing','data-structures','algorithms','concurrency','caching','distributed-systems'],
  math:['throughput','performance-measurement','complexity','latency','optimization-math','statistics','probability','recursion'],
  tools:['cpp','cmake','python','docker','git','linux','github-actions','postgres'],
  practices:['reproducibility','testing','profiling','debugging','tradeoffs','observability','documentation','design-patterns']
 },
 cloud:{
  domains:['backend-systems','data-engineering','fullstack','systems','production-reliability'],
  methods:['rest-apis','integration-testing','data-pipelines','error-handling','deployment','distributed-systems','security','caching'],
  math:['time-counts','throughput','performance-measurement','complexity','statistics','probability'],
  tools:['docker','fastapi','postgres','git','github-actions','aws','azure','k8s'],
  practices:['observability','testing','documentation','debugging','code-review','requirements','design-patterns','reproducibility']
 }
};
const openingPicks={
 domains:['systems','vision','retrieval','data-engineering','ml-eval','quantum-sim','quant-finance','fullstack'],
 methods:['benchmark','anomaly','semantic-search','search-ranking','forecasting','scenario-gen','circuit-design','rest-apis'],
 math:['probability','statistics','linear-algebra','optimization-math','time-series','uncertainty','auroc','throughput'],
 tools:['python','cpp','sql','pytorch','fastapi','react','postgres','qiskit'],
 practices:['problem-framing','experiment-design','reproducibility','debugging','communication','systems-thinking','research-synthesis','testing']
};
const panelSkillStatus=n=>n.kind==='documented'?'PROJECT-BACKED':n.kind==='foundational'?'FOUNDATIONAL CONTEXT':'EXPLORING · NO PROJECT PROOF';
const trackFor=id=>skillTracks.find(t=>t.id===id)||skillTracks[0];

export function mountSkillNetwork({onShowNotes}={}){
 const root=document.querySelector('.skill-atlas-module');
 const stage=document.getElementById('project-graphic');
 const viewport=document.getElementById('skill-atlas-viewport');
 const svg=document.getElementById('project-connections');
 const rail=document.getElementById('skill-atlas-columns');
 const mobile=document.getElementById('project-mobile');
 const panel=document.getElementById('project-focus');
 const tabs=document.getElementById('skill-layer-tabs');
 const search=document.getElementById('skill-atlas-search');
 const previous=document.getElementById('skill-layer-previous');
 const next=document.getElementById('skill-layer-next');
 const status=document.getElementById('skill-atlas-status');
 const motion=document.getElementById('project-motion-toggle');
 const reset=document.getElementById('project-reset-network');
 const readout=document.getElementById('project-signal-readout');
 if([root,stage,viewport,svg,rail,mobile,panel,tabs,search,previous,next,status,motion,reset,readout].some(x=>!x))return null;
 const canvas=viewport.querySelector('.skill-atlas-canvas');
 const nav=document.querySelector('.skill-atlas-navigation');
 const controls=document.createElement('div');
 controls.className='skill-v2-view-controls';
 controls.innerHTML='<button type="button" id="skill-library-toggle" aria-expanded="false">Browse full skill library</button><span><i class="skill-key-solid"></i> Project-backed</span><span><i class="skill-key-outline"></i> To explore</span>';
 nav.append(controls);
 const browse=controls.querySelector('#skill-library-toggle');
 const roleGuide=document.createElement('div');roleGuide.className='skill-role-guide';
 roleGuide.innerHTML='<span class="skill-role-guide-label">EXPLORE BY CAREER TRACK</span><span class="skill-role-guide-hint">Select a track to illuminate its skills · Select a node for evidence</span>';
 nav.insertBefore(roleGuide,tabs);
 const mapLegend=document.createElement('div');mapLegend.className='skill-connectivity-legend';
 mapLegend.innerHTML='<span><i class="skill-line-key skill-line-proof"></i> Project-backed relationship</span><span><i class="skill-line-key skill-line-context"></i> Related learning topic · not project proof</span><span class="skill-clear-hint">Click again or press Esc to clear</span>';
 root.querySelector('.skill-atlas-stage').append(mapLegend);
 const subfilters=document.createElement('div');subfilters.className='skill-software-subfilters';subfilters.setAttribute('role','group');subfilters.setAttribute('aria-label','Software engineering specialization');
 subfilters.innerHTML='<span>SOFTWARE FOCUS</span>'+[['all','Overview'],['backend','Backend'],['systems','Systems'],['cloud','Cloud / Reliability']].map(([id,label])=>`<button type="button" data-software-focus="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('');
 nav.append(subfilters);
 const trackIds=skillTracks.map(t=>t.id);
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let track='all',softwareFocus='all',query='',selected=null,hovered=null,libraryOpen=false,signals=!reduced();
 let visible=[],positions=new Map(),visibleEdges=[],nodeWidth=150,columnWidth=180,actualWidth=1100;
 const allForTrack=()=>skillNodes.filter(n=>track==='all'||n.tracks.includes(track));
 const match=n=>[n.title,n.description,n.kind].some(v=>v.toLowerCase().includes(query));
 function getGroups(){
  const candidates=allForTrack();
  const direct=query?candidates.filter(match):[];
  const matchProjects=new Set(direct.flatMap(n=>n.projects));
  const current=selected?skillsById.get(selected):null;
  const activeProjects=new Set(current?.projects||[]);
  const limit=8;
  return columns.map(group=>{
   const list=group==='projects'?skillNodes.filter(n=>n.column==='projects'):candidates.filter(n=>n.column===group);
   const score=n=>{
    let points=(n.featured?20:0)+(n.kind==='documented'?9:n.kind==='foundational'?2:0);
    const pinned=track==='all'?openingPicks[group]:track==='software'&&softwareFocus!=='all'?softwareFocusPicks[softwareFocus]?.[group]:trackPicks[track]?.[group];
    if(!query&&!selected&&pinned?.includes(n.id.replace(/^skill-/,'')))points+=130;
    if(activeProjects.size&&n.projects.some(id=>activeProjects.has(id)))points+=110;
    if(query){if(match(n))points+=220;if(n.projects.some(p=>matchProjects.has(p)))points+=85;}
    if(n.id===selected)points+=600;
    return points;
   };
   const choices=[...list].sort((a,b)=>score(b)-score(a)||list.indexOf(a)-list.indexOf(b));
   let chosen=group==='projects'?[...list]:choices.slice(0,limit);
   if(query && direct.length && chosen.every(n=>!match(n))){const exact=list.find(match);if(exact)chosen=[...chosen.slice(0,limit-1),exact];}
   // Stable storytelling order with each column arranged top to bottom.
   return chosen.sort((a,b)=>list.indexOf(a)-list.indexOf(b));
  });
 }
 function clearSelection({keepLibrary=false}={}){
  selected=null;hovered=null;
  if(!keepLibrary)libraryOpen=false;
  render();renderPanel();
 }
 function render(){
  // The graph always occupies the width available *beside* the details panel.
  // No fixed 1224px canvas and no sideways scroll/slider.
  actualWidth=Math.max(330,Math.round(viewport.clientWidth||1080));
  columnWidth=actualWidth/columns.length;
  nodeWidth=Math.max(98,columnWidth-24);
  const graphHeight=754;
  canvas.style.width=actualWidth+'px';canvas.style.height=graphHeight+'px';
  for(const element of [stage,rail,svg]){element.style.width=actualWidth+'px';element.style.height=graphHeight+'px';}
  stage.style.height=graphHeight+'px';
  svg.setAttribute('viewBox',`0 0 ${actualWidth} ${graphHeight}`);
  const groups=getGroups();
  visible=groups.flat();positions=new Map();
  rail.innerHTML=skillColumns.map((c,i)=>`<div class="skill-column" style="left:${i*columnWidth}px;width:${columnWidth}px;height:${graphHeight}px"><span>${String(i+1).padStart(2,'0')} / ${esc(c.label)}</span></div>`).join('');
  stage.innerHTML=groups.flatMap((group,i)=>group.map((n,k)=>{
   // Seven evenly spaced project rows and eight skill rows preserve the earlier
   // portfolio graph's balanced, fixed-height composition across role filters.
   const step=group.length>1?Math.min(78,520/(group.length-1)):0;
   const top=140+(520-step*(group.length-1))/2;
   const xy={x:i*columnWidth+12,y:top+step*k};positions.set(n.id,xy);
   return `<button type="button" class="skill-node skill-v2-node ${n.kind==='explore'?'skill-v2-explore':n.kind==='foundational'?'skill-v2-foundation':''}" style="left:${xy.x}px;top:${xy.y}px;width:${nodeWidth}px" data-skill-id="${esc(n.id)}" data-state="${esc(n.kind)}" aria-pressed="${n.id===selected}" title="${esc(n.description)}"><span class="skill-node-index">${String(i+1).padStart(2,'0')}</span><span class="skill-node-title">${esc(n.title)}</span><small>${esc(n.kind==='explore'?'TO EXPLORE':n.kind==='foundational'?'FOUNDATION':cLabel(i))}</small></button>`;
  })).join('');
  // Project-backed paths remain authoritative. When curation hides an endpoint,
  // a contextual (dashed) relation provides discoverability, never invented proof.
  const authoritative=skillLinks.filter(link=>positions.has(link.from)&&positions.has(link.to))
    .map(link=>({...link,kind:'evidence'}));
  const connected=new Set(authoritative.flatMap(e=>[e.from,e.to]));
  const supplemental=[];
  const colFor=new Map(visible.map(node=>[node.id,columns.indexOf(node.column)]));
  for(const node of visible){
   if(connected.has(node.id))continue;
   const ix=colFor.get(node.id);
   const neighbors=visible.filter(other=>Math.abs(colFor.get(other.id)-ix)===1);
   if(!neighbors.length)continue;
   const target=neighbors.map(other=>{
    const shared=node.projects.some(p=>other.projects.includes(p));
    const sameRole=node.tracks.some(t=>other.tracks.includes(t));
    const dy=Math.abs(positions.get(node.id).y-positions.get(other.id).y);
    return {other,score:(shared?1000:0)+(sameRole?110:0)-dy};
   }).sort((a,b)=>b.score-a.score)[0].other;
   const before=ix<colFor.get(target)?node:target;
   const after=ix<colFor.get(target)?target:node;
   supplemental.push({from:before.id,to:after.id,projects:[],kind:'context'});
   connected.add(node.id);connected.add(target.id);
  }
  visibleEdges=[...authoritative,...supplemental];
  root.dataset.visibleNodes=String(visible.length);
  root.dataset.visibleConnections=String(visibleEdges.length);
  root.dataset.orphanNodes=String(visible.filter(n=>!visibleEdges.some(e=>e.from===n.id||e.to===n.id)).length);
  svg.innerHTML=visibleEdges.map((link,i)=>{
   const a=positions.get(link.from),b=positions.get(link.to);
   const x1=a.x+nodeWidth,x2=b.x,y1=a.y,y2=b.y;
   return `<path class="skill-edge ${link.kind==='context'?'skill-edge-context':'skill-edge-proof'}" data-skill-edge="${esc(link.from+'|'+link.to)}" data-edge-kind="${link.kind}" aria-label="${link.kind==='context'?'Related learning topic, not project proof':'Project-backed relationship'}" d="M${x1} ${y1} C${x1+Math.max(24,(x2-x1)*.44)} ${y1}, ${x2-Math.max(24,(x2-x1)*.44)} ${y2}, ${x2} ${y2}" style="--edge-delay:-${(i%12)*.31}s"/>`;
  }).join('');
  mobile.innerHTML=groups.map((group,i)=>`<details class="skill-mobile-group" ${query&&group.some(match)||!query&&i===0?'open':''}><summary>${String(i+1).padStart(2,'0')} / ${esc(skillColumns[i].label)} <span>${group.length} featured</span></summary><div>${group.map(n=>`<button type="button" data-skill-id="${esc(n.id)}" aria-pressed="${n.id===selected}">${esc(n.title)}${n.kind==='explore'?' · To explore':''}</button>`).join('')}</div></details>`).join('');
  updateHighlight();
 }
 function cLabel(index){return skillColumns[index].label.toUpperCase();}
 function updateHighlight(){
  const n=skillsById.get(hovered||selected);
  const support=new Set(n?.projects||[]);
  const activeLinks=visibleEdges.filter(link=>n&&(link.from===n.id||link.to===n.id||link.kind==='evidence'&&link.projects.some(p=>support.has(p))));
  const connected=new Set([n?.id,...activeLinks.flatMap(e=>[e.from,e.to])]);
  const activeEdges=new Set(activeLinks.map(x=>x.from+'|'+x.to));
  for(const b of stage.querySelectorAll('[data-skill-id]')){
   const id=b.dataset.skillId,focused=Boolean(n);
   b.classList.toggle('is-selected',id===selected);
   b.classList.toggle('is-related',focused&&connected.has(id));
   b.classList.toggle('is-muted',focused&&id!==n.id&&!connected.has(id));
   b.setAttribute('aria-pressed',String(id===selected));
  }
  for(const b of mobile.querySelectorAll('[data-skill-id]'))b.setAttribute('aria-pressed',String(b.dataset.skillId===selected));
  for(const path of svg.querySelectorAll('[data-skill-edge]')){
   path.classList.toggle('is-related',Boolean(n)&&activeEdges.has(path.dataset.skillEdge));
   path.classList.toggle('is-muted',Boolean(n)&&!activeEdges.has(path.dataset.skillEdge));
  }
  for(const b of tabs.querySelectorAll('[data-skill-track]'))b.setAttribute('aria-pressed',String(b.dataset.skillTrack===track));
  readout.textContent=`${skillNodes.length} topics · ${skillLinks.length} evidence-linked paths`;
  status.textContent=trackFor(track).label+' · '+visible.length+' visible';
  previous.disabled=track===trackIds[0];next.disabled=track===trackIds.at(-1);
  reset.disabled=track==='all'&&!selected&&!query&&!libraryOpen;
  motion.disabled=reduced();motion.setAttribute('aria-pressed',String(signals&&!reduced()));
  motion.textContent=signals&&!reduced()?'Pause signals':'Play signals';
  root.classList.toggle('is-signals-paused',!signals||reduced());
  browse.setAttribute('aria-expanded',String(libraryOpen));
  browse.textContent=libraryOpen?'Close skill library':'Browse full skill library';
  subfilters.hidden=track!=='software';
  for(const b of subfilters.querySelectorAll('[data-software-focus]'))b.setAttribute('aria-pressed',String(b.dataset.softwareFocus===softwareFocus));
 }
 function panelOverview(){
  const info=trackFor(track);
  const focusSummary=track==='software'&&softwareFocus!=='all'?({backend:'Backend focus: API behavior, databases and integration testing.',systems:'Systems focus: C++ correctness, complexity, performance and concurrency.',cloud:'Cloud focus: containers and reliability, with non-demonstrated deployment skills clearly marked for exploration.'})[softwareFocus]:null;
  panel.innerHTML=`<div class="network-focus-top"><span>KNOWLEDGE NETWORK</span><span>${esc(info.label.toUpperCase())}</span></div><p class="network-focus-category">PROJECTS · SKILLS · EVIDENCE</p><h3>How the work connects.</h3><p class="network-focus-copy">${esc(focusSummary||info.summary)} Select any node to inspect its evidence, or choose a career track above.</p><div class="skill-v2-stats"><div><strong>${skillNodes.length}</strong><span>Topics</span></div><div><strong>06</strong><span>Layers</span></div><div><strong>${skillTracks.length-1}</strong><span>Tracks</span></div></div><p class="skill-proof-note">Project-backed relationships are distinct from foundational concepts and areas I'm exploring. None of these are proficiency scores.</p><button type="button" class="skill-explore-start" data-skill-id="transitpulse">Explore TransitPulse</button><button type="button" class="skill-library-link" data-open-library>View full skills index</button>`;
 }
 function panelDetail(id){
  const n=skillsById.get(id);if(!n){panelOverview();return;}
  const supported=n.projects.map(p=>projects.find(x=>x.id===p)).filter(Boolean);
  const related=skillNodes.filter(other=>other.id!==id&&other.column!==n.column&&other.projects.some(p=>n.projects.includes(p))).slice(0,5);
  const summary=n.project?n.project.description.split(/(?<=[.!?])\s+/).slice(0,2).join(' '):n.description;
  panel.innerHTML=`<div class="network-focus-top"><span>${esc(skillColumns.find(c=>c.id===n.column)?.label||'PROJECT')}</span><button type="button" class="skill-clear-selection" data-skill-clear aria-label="Clear skill selection">✕ Clear</button></div><p class="network-focus-category">${esc(panelSkillStatus(n))}</p><h3>${esc(n.title)}</h3><p class="network-focus-copy">${esc(summary)}</p>${n.project?`<div class="network-focus-result network-focus-result-compact"><strong>${esc(n.project.result)}</strong><span>${esc(n.project.resultLabel)}</span></div><img class="skill-project-art" src="${esc(n.project.image)}" alt="Concept artwork for ${esc(n.title)}" loading="lazy">`:''}<div class="network-focus-links"><strong>${supported.length?'CONNECTED PROJECTS':'NO PROJECT EVIDENCE YET'}</strong><div>${supported.length?supported.map(p=>`<button type="button" data-skill-id="${esc(p.id)}">${esc(p.name)}</button>`).join(''):'<p class="skill-v2-empty">Included as role-relevant knowledge, not claimed as an implemented skill.</p>'}</div></div>${n.project?`<div class="project-network-actions"><button class="project-network-case" type="button" data-skill-case="${esc(n.id)}">Engineering notes</button>${n.project.repo?`<a href="${esc(n.project.repo)}" target="_blank" rel="noopener noreferrer">Repository</a>`:''}</div>`:''}${related.length?`<div class="network-focus-links"><strong>RELATED IN THESE PROJECTS</strong><div>${related.map(o=>`<button type="button" data-skill-id="${esc(o.id)}">${esc(o.title)}</button>`).join('')}</div></div>`:''}<p class="skill-proof-note">${esc(n.kind==='explore'?'Learning direction — no claimed project implementation.':n.kind==='foundational'?'Contextual foundation. Project links do not independently verify proficiency.':'Project-linked context only; check the code and engineering notes for exact scope.')}</p>`;
 }
 function panelLibrary(){
  const list=allForTrack().filter(n=>!query||match(n));
  panel.innerHTML=`<div class="network-focus-top"><span>FULL SKILL INDEX</span><button type="button" class="skill-clear-selection" data-close-library>✕ Close</button></div><p class="network-focus-category">${list.length} MATCHING TOPICS</p><h3>Explore every skill.</h3><p class="network-focus-copy">Browse the complete library without adding clutter to the graph. Search to narrow results, then select a topic to highlight its connections.</p><div class="skill-library-index">${skillColumns.map(c=>{const nodes=list.filter(n=>n.column===c.id);return nodes.length?`<details ${query?'open':''}><summary>${esc(c.label)} <span>${nodes.length}</span></summary><div>${nodes.map(n=>`<button type="button" data-skill-id="${esc(n.id)}"><span>${esc(n.title)}</span><small>${esc(categories[n.kind])}</small></button>`).join('')}</div></details>`:'';}).join('')}</div>`;
 }
 function renderPanel(){if(selected)panelDetail(selected);else if(libraryOpen)panelLibrary();else panelOverview();updateHighlight();}
 function pick(id){
  if(!skillsById.has(id))return;
  if(selected===id){clearSelection();return;}
  const n=skillsById.get(id);
  if(track!=='all'&&!n.tracks.includes(track))track='all';
  selected=id;hovered=null;libraryOpen=false;
  render();renderPanel();
  // Search can match a node in an otherwise sparse group; always reveal its mobile group.
  const b=[...mobile.querySelectorAll('[data-skill-id]')].find(x=>x.dataset.skillId===id);
  b?.closest('details')?.setAttribute('open','');
 }
 function changeTrack(id){
  if(!trackIds.includes(id))return;
  track=id;softwareFocus='all';selected=null;hovered=null;libraryOpen=false;search.value='';query='';
  render();renderPanel();
 }
 function resetAll(){changeTrack('all');}
 tabs.innerHTML=skillTracks.map(t=>`<button type="button" data-skill-track="${esc(t.id)}" aria-pressed="${t.id==='all'}" aria-label="${esc(t.label)} career track">${esc(t.label)}</button>`).join('');
 tabs.addEventListener('click',e=>{const t=e.target.closest('[data-skill-track]');if(t)changeTrack(t.dataset.skillTrack);});
 viewport.addEventListener('click',e=>{
  const b=e.target.closest('[data-skill-id]');if(b){pick(b.dataset.skillId);return;}
  clearSelection();
 });
 stage.addEventListener('pointerover',e=>{const b=e.target.closest('[data-skill-id]');if(b&&hovered!==b.dataset.skillId){hovered=b.dataset.skillId;updateHighlight();}});
 stage.addEventListener('pointerout',e=>{const b=e.target.closest('[data-skill-id]');if(b&&!b.contains(e.relatedTarget)){hovered=null;updateHighlight();}});
 stage.addEventListener('focusin',e=>{const b=e.target.closest('[data-skill-id]');if(b){hovered=b.dataset.skillId;updateHighlight();}});
 stage.addEventListener('focusout',e=>{if(e.target.closest('[data-skill-id]')){hovered=null;updateHighlight();}});
 mobile.addEventListener('click',e=>{const b=e.target.closest('[data-skill-id]');if(b)pick(b.dataset.skillId);});
 panel.addEventListener('click',e=>{
  const b=e.target.closest('[data-skill-id]');if(b){pick(b.dataset.skillId);return;}
  if(e.target.closest('[data-skill-clear]')){clearSelection();return;}
  if(e.target.closest('[data-open-library]')){libraryOpen=true;selected=null;renderPanel();return;}
  if(e.target.closest('[data-close-library]')){libraryOpen=false;renderPanel();return;}
  const note=e.target.closest('[data-skill-case]');if(note)onShowNotes?.(note.dataset.skillCase);
 });
 browse.addEventListener('click',()=>{libraryOpen=!libraryOpen;selected=null;renderPanel();});
 subfilters.addEventListener('click',e=>{const b=e.target.closest('[data-software-focus]');if(!b)return;softwareFocus=b.dataset.softwareFocus;selected=null;hovered=null;libraryOpen=false;render();renderPanel();});
 search.addEventListener('input',()=>{query=search.value.trim().toLowerCase();selected=null;
  if(query&&!allForTrack().some(match)&&skillNodes.some(match))track='all';
  render();renderPanel();
 });
 search.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();search.value='';query='';clearSelection();search.blur();}
  if(e.key==='Enter'&&query){const first=allForTrack().find(match);if(first){e.preventDefault();pick(first.id);}}
 });
 const keyHandler=e=>{
  if(e.key!=='Escape'||!selected)return;
  if(e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  const area=root.getBoundingClientRect();
  const visibleSection=area.bottom>innerHeight*.18&&area.top<innerHeight*.82;
  if(!root.contains(document.activeElement)&&!root.contains(e.target)&&!visibleSection)return;
  e.preventDefault();clearSelection();
 };
 document.addEventListener('keydown',keyHandler);
 previous.addEventListener('click',()=>changeTrack(trackIds[Math.max(0,trackIds.indexOf(track)-1)]));
 next.addEventListener('click',()=>changeTrack(trackIds[Math.min(trackIds.length-1,trackIds.indexOf(track)+1)]));
 reset.addEventListener('click',resetAll);
 motion.addEventListener('click',()=>{signals=!signals;updateHighlight();});
 // Keep visible graph aligned if its container width changes; never create a slider.
 const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(entries=>{
  const w=Math.round(entries[0]?.contentRect.width||0);
  if(w&&Math.abs(w-actualWidth)>2)render();
 }):null;
 ro?.observe(viewport);
 render();renderPanel();
 return {focus:pick,showAll:resetAll,destroy(){ro?.disconnect();document.removeEventListener('keydown',keyHandler);}};
}
