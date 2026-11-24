import {projects} from './data.mjs';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const HEIGHT=920;
const features=[
 ['systems','Systems engineering','I work on how separate parts of a system behave together, including the core rules, APIs and interfaces that depend on them.'],
 ['testing','Deterministic testing','I use repeatable tests to check that engineering changes do not silently change the expected behavior.'],
 ['vision','Computer vision','I explore how image features can identify unusual regions in product images, even when defect examples are limited.'],
 ['retrieval','Research retrieval','I combine keyword and semantic search to retrieve useful papers when the question and the source use different wording.'],
 ['data','Data pipelines','I collect, validate and store observations so the information shown in an interface has a reliable source and timestamp.'],
 ['frontend','Interactive frontend','I build interfaces that let someone investigate technical results and understand the context behind a chart or map.'],
 ['evaluation','ML evaluation','I compare baselines and held-out results to check whether a model improvement is supported by the experiment.'],
 ['quantum','Quantum simulation','I use simulations to investigate circuit-depth choices and quantum-network behavior under controlled conditions.'],
 ['forecast','Robust forecasting','I investigate how predictions change when the conditions used to generate training data no longer stay the same.'],
 ['finance','Quantitative modeling','I explore trading rules and simulated market outcomes, paying attention to what the measurements do and do not establish.']
];
const tech=[
 ['cpp','C++20','I used C++20 for the matching engine and its deterministic order-processing rules.'],
 ['cmake','CMake','I used CMake to organize the ExchangeCore build.'],
 ['python','Python','Python supports the data processing and experiments across several of my projects.'],
 ['pytorch','PyTorch','I used PyTorch in Scanner and SimShift-Q for machine-learning experiments.'],
 ['streamlit','Streamlit','Scanner uses Streamlit to make image-inspection results explorable.'],
 ['dinov2','DINOv2','Scanner uses pretrained DINOv2 features to compare visual regions with normal examples.'],
 ['react','React','I used React to build interfaces for systems such as EvidenceSearch and TransitPulse.'],
 ['typescript','TypeScript','TransitPulse uses TypeScript in its React frontend.'],
 ['fastapi','FastAPI','I used FastAPI to expose data and search functions in EvidenceSearch and TransitPulse.'],
 ['postgres','PostgreSQL','TransitPulse stores captured vehicle observations in PostgreSQL.'],
 ['qiskit','Qiskit','QuantumOptLab uses Qiskit to construct and study optimization circuits.'],
 ['aer','Qiskit Aer','I used Qiskit Aer to run QuantumOptLab experiments with simulated noise.']
];
// Exact project/technology evidence from the associated project descriptions.
// These links should not be inferred merely from two projects sharing a capability.
export const projectTechnologyEvidence={
 exchangecore:['cpp','cmake','python','react'],
 scanner:['python','pytorch','dinov2','streamlit'],
 evidencesearch:['python','fastapi','react'],
 transitpulse:['python','fastapi','react','typescript','postgres'],
 quantumoptlab:['python','qiskit','aer'],
 'simshift-q':['python','pytorch'],
 financialscenarios:['python']
};
const projectEdges={
 exchangecore:['systems','testing','finance','frontend'],
 scanner:['vision','evaluation','frontend'],
 evidencesearch:['retrieval','evaluation','frontend'],
 transitpulse:['data','frontend','systems'],
 quantumoptlab:['quantum','evaluation','frontend'],
 'simshift-q':['quantum','forecast','evaluation'],
 financialscenarios:['finance','forecast','frontend']
};
const techEdges={
 systems:['cpp','cmake','python','fastapi'],
 testing:['cpp','cmake','python'],
 vision:['python','pytorch','dinov2','streamlit'],
 retrieval:['python','fastapi','react'],
 data:['python','fastapi','postgres'],
 frontend:['react','typescript','fastapi'],
 evaluation:['python','pytorch','qiskit'],
 quantum:['python','qiskit','aer','pytorch'],
 forecast:['python','pytorch'],
 finance:['cpp','python']
};
export const projectGraph={
 nodes:[
  ...projects.map((p,i)=>({id:p.id,name:p.name,short:p.name,layer:0,y:98+i*122,category:'PROJECT',description:p.description,project:p})),
  ...features.map(([id,name,description],i)=>({id,name,short:name,layer:1,y:56+i*91,category:'CAPABILITY',description})),
  ...tech.map(([id,name,description],i)=>({id,name,short:name,layer:2,y:40+i*76,category:'TECHNOLOGY',description}))
 ],
 edges:[...Object.entries(projectEdges).flatMap(([project,skills])=>skills.map(skill=>[project,skill])),...Object.entries(techEdges).flatMap(([skill,langs])=>langs.map(lang=>[skill,lang]))]
};
const edgeKey=(a,b)=>`${a}|${b}`;
const graphById=new Map(projectGraph.nodes.map(n=>[n.id,n]));

/** A trace is an editorial evidence path, never a trained weight or proficiency score.
 * Project selection only lights project->capability->technology links whose final
 * technology is documented for the selected project. Capability/technology views
 * show thematic connections, scoped to their immediate relationships.
 */
export function traceProjectGraph(id=null){
 const edgeKeys=new Set();
 const nodeIds=new Set();
 if(!id||!graphById.has(id)){
  for(const n of projectGraph.nodes)nodeIds.add(n.id);
  for(const [a,b] of projectGraph.edges)edgeKeys.add(edgeKey(a,b));
  return {nodeIds,edgeKeys};
 }
 const n=graphById.get(id);
 const add=(a,b)=>{edgeKeys.add(edgeKey(a,b));nodeIds.add(a);nodeIds.add(b)};
 nodeIds.add(id);
 if(n.layer===0){
  const approved=new Set(projectTechnologyEvidence[id]||[]);
  for(const cap of projectEdges[id]||[]){
   add(id,cap);
   for(const technology of techEdges[cap]||[])if(approved.has(technology))add(cap,technology);
  }
 }else if(n.layer===1){
  for(const [project,caps] of Object.entries(projectEdges))if(caps.includes(id))add(project,id);
  for(const technology of techEdges[id]||[])add(id,technology);
 }else{
  for(const [cap,technologies] of Object.entries(techEdges)){
   if(!technologies.includes(id))continue;
   add(cap,id);
   for(const [project,caps] of Object.entries(projectEdges)){
    if(caps.includes(cap)&&(projectTechnologyEvidence[project]||[]).includes(id))add(project,cap);
   }
  }
 }
 return {nodeIds,edgeKeys};
}

export function mountProjectNetwork({onShowNotes}={}){
 const shell=document.getElementById('project-graphic');if(!shell)return null;
 const svg=document.getElementById('project-connections');
 const fit=document.getElementById('project-fit');
 const detail=document.getElementById('project-focus');
 const mobile=document.getElementById('project-mobile');
 const network=fit.closest('.project-network');
 const controls=document.getElementById('project-network-controls');
 const motionButton=document.getElementById('project-motion-toggle');
 const resetButton=document.getElementById('project-reset-network');
 const readout=document.getElementById('project-signal-readout');
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const nodes=projectGraph.nodes;
 const byId=graphById;
 const adjacent=new Map(nodes.map(n=>[n.id,new Set()]));
 projectGraph.edges.forEach(([a,b])=>{adjacent.get(a).add(b);adjacent.get(b).add(a)});
 let active=null,hovered=null;
 let motionEnabled=!reduced();
 const nodesForLayer=layer=>nodes.filter(n=>n.layer===layer);
 const x=[130,505,866];
 function render(){
  shell.innerHTML=nodes.map(n=>`<button type="button" class="network-node network-node-${n.layer}" data-project-node="${e(n.id)}" aria-label="Explore ${e(n.name)}" aria-pressed="false" aria-controls="project-focus" style="left:${x[n.layer]}px;top:${n.y}px"><span class="network-node-orb" aria-hidden="true"></span><span class="network-node-label">${e(n.short)}</span><span class="network-node-foot">${e(n.category)}</span></button>`).join('');
  const defs='<defs><linearGradient id="projectSynapse" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#378ec1"/><stop offset=".44" stop-color="#7dd7ff"/><stop offset="1" stop-color="#57b5ed"/></linearGradient></defs>';
  svg.innerHTML=defs+projectGraph.edges.map(([a,b],i)=>{
   const n=byId.get(a),m=byId.get(b);
   const ax=x[n.layer]+(n.layer===0?105:100),bx=x[m.layer]-(m.layer===1?100:88);
   const d=`M${ax} ${n.y} C${ax+58} ${n.y},${bx-58} ${m.y},${bx} ${m.y}`;
   const attrs=`data-from="${e(a)}" data-to="${e(b)}" data-edge="${e(edgeKey(a,b))}" d="${d}"`;
   return `<path class="network-edge" ${attrs}/><path class="network-edge-flow" ${attrs} style="--signal-delay:-${(i%13)*.37}s;--signal-speed:${(6.8+(i%5)*.55).toFixed(2)}s"/>`;
  }).join('');
  mobile.innerHTML=[0,1,2].map((layer)=>`<details class="network-mobile-layer" ${layer===0?'open':''}><summary>${['01 / PROJECTS','02 / CAPABILITIES','03 / TECHNOLOGIES'][layer]}</summary><div>${nodesForLayer(layer).map(n=>`<button type="button" data-project-node="${e(n.id)}" aria-pressed="false" aria-controls="project-focus">${e(n.short)}</button>`).join('')}</div></details>`).join('');
  draw();
 }
 function draw(){
  const picked=hovered||active;
  const trace=traceProjectGraph(picked);
  fit.classList.toggle('network-overview',!picked);
  shell.querySelectorAll('[data-project-node]').forEach(el=>{
   const id=el.dataset.projectNode;
   el.classList.toggle('is-selected',id===active);
   el.classList.toggle('is-preview',id===hovered);
   el.classList.toggle('is-related',Boolean(picked)&&trace.nodeIds.has(id));
   el.classList.toggle('is-muted',Boolean(picked)&&!trace.nodeIds.has(id));
   el.setAttribute('aria-pressed',String(id===active));
  });
  mobile.querySelectorAll('button').forEach(el=>{
   el.classList.toggle('is-selected',el.dataset.projectNode===active);
   el.setAttribute('aria-pressed',String(el.dataset.projectNode===active));
  });
  svg.querySelectorAll('[data-edge]').forEach(el=>{
   const lit=trace.edgeKeys.has(el.dataset.edge);
   el.classList.toggle('is-related',Boolean(picked)&&lit);
   el.classList.toggle('is-muted',Boolean(picked)&&!lit);
  });
  if(readout)readout.textContent=picked?`${trace.edgeKeys.size} illuminated links / ${trace.nodeIds.size} nodes`:`${projectGraph.edges.length} glowing links / ${nodes.length} nodes`;
  if(resetButton)resetButton.disabled=!active;
  network.classList.toggle('is-signal-paused',!motionEnabled||reduced());
  if(motionButton){motionButton.setAttribute('aria-pressed',String(motionEnabled&&!reduced()));motionButton.textContent=motionEnabled&&!reduced()?'Pause signals':'Play signals';motionButton.disabled=reduced();}
 }
 const projectSummaries={
  "exchangecore": "I built a C++20 order-matching engine to test how a trading system can follow price–time priority and still run quickly. The measured throughput belongs to one engine-only workload.",
  "scanner": "I built a visual-inspection tool that compares unfamiliar product images with normal examples. I tested it on held-out images and checked whether frozen alerts were reproduced consistently.",
  "evidencesearch": "I combined keyword and semantic retrieval to help find research papers even when the wording doesn't match. I measured ranking quality on a reserved internal SciFact configuration.",
  "transitpulse": "I collect WMATA vehicle snapshots and make them explorable in a React map with a FastAPI backend. Recorded positions include their capture context; they aren't presented as live movement.",
  "quantumoptlab": "I used Qiskit simulations to ask whether deeper QAOA circuits are worth their extra cost when noise is involved. On held-out graphs, the learned depth selector did not outperform a simpler gate-budget rule.",
  "simshift-q": "I studied whether forecasts of simulated quantum-network deliveries hold up when network conditions change. I evaluated whole simulation runs and treated the small error improvement cautiously.",
  "financialscenarios": "I built a research interface for generating possible market outcomes under different economic assumptions. The charts explore uncertainty and downside risk, not verified future prices."
};
 const linkButtons=(neighbors)=>neighbors.map(x=>`<button data-project-node="${e(x.id)}" type="button">${e(x.short)}</button>`).join('');
 let renderedId=null,renderedAsPreview=false;
 const announce=document.createElement('span');announce.className='network-sr-only';announce.setAttribute('role','status');announce.setAttribute('aria-live','polite');controls?.appendChild(announce);
 function renderDetail(id=active,{preview=false}={}){
  if(!id||!byId.has(id))return;
  if(renderedId===id&&renderedAsPreview===preview)return;
  renderedId=id;renderedAsPreview=preview;detail.dataset.showingOverview='no';
  const n=byId.get(id),neighbors=[...(adjacent.get(id)||[])].map(key=>byId.get(key));
  const trace=traceProjectGraph(id);
  const stateLabel=preview?'HOVER PREVIEW · CLICK TO PIN':'SELECTED · PINNED';
  if(n.layer===0){
   const p=n.project;
   detail.innerHTML=`<div class="network-focus-top"><span>PROJECT / ${String(projects.findIndex(x=>x.id===p.id)+1).padStart(2,'0')}</span><span>${stateLabel}</span></div><p class="network-focus-category">${e(p.kind)}</p><h3>${e(p.name)}</h3><div class="project-network-tags">${p.disciplines.map(d=>`<span>${e(d)}</span>`).join('')}</div><p class="network-focus-copy network-focus-lead">${e(projectSummaries[id]||p.description)}</p><div class="network-focus-result network-focus-result-compact"><strong>${e(p.result)}</strong><span>${e(p.resultLabel)}</span></div><figure class="project-network-image network-preview-image"><img loading="lazy" width="640" height="360" src="${e(p.image)}" alt="Concept cover for ${e(p.name)}"></figure><div class="project-network-tags network-focus-tools">${p.roles.map(t=>`<span>${e(t)}</span>`).join('')}</div><div class="network-focus-links"><strong>TRACE THIS PROJECT (${trace.edgeKeys.size} CONNECTIONS)</strong><div>${preview?`<span class="network-preview-hint">Click the node to pin its connections and open its engineering notes.</span>`:linkButtons(neighbors)}</div></div>${preview?'':`<div class="project-network-actions"><button type="button" class="project-network-case" data-case="${e(p.id)}">Engineering notes</button>${p.repo?`<a href="${e(p.repo)}" target="_blank" rel="noopener noreferrer">Repository</a>`:`<span>${e(p.sourceStatus||'Source not public')}</span>`}</div>`}`;
  }else{
   const matches=projects.filter(p=>n.layer===2?(projectTechnologyEvidence[p.id]||[]).includes(n.id):(projectEdges[p.id]||[]).includes(n.id));
   detail.innerHTML=`<div class="network-focus-top"><span>${e(n.category)} / ${String(n.layer+1).padStart(2,'0')}</span><span>${stateLabel}</span></div><p class="network-focus-category">${n.layer===1?'ENGINEERING CAPABILITY':'LANGUAGE / FRAMEWORK'}</p><h3>${e(n.name)}</h3><p class="network-focus-copy network-focus-lead">${e(n.description)}</p><div class="network-focus-result network-focus-result-compact"><strong>${matches.length.toString().padStart(2,'0')}</strong><span>connected portfolio ${matches.length===1?'project':'projects'} · illustrative relationships</span></div><div class="network-focus-links"><strong>EXPLORE RELATED PROJECTS</strong><div>${preview?`<span class="network-preview-hint">${matches.map(p=>e(p.name)).join(' · ')}</span>`:matches.map(p=>`<button data-project-node="${e(p.id)}" type="button">${e(p.name)}</button>`).join('')}</div></div>${preview?'':`<div class="network-focus-links"><strong>FOLLOW CONNECTIONS (${neighbors.length})</strong><div>${linkButtons(neighbors)}</div></div>`}`;
  }
  if(!preview)detail.insertAdjacentHTML('beforeend','<p class="network-disclaimer">Links reflect documented projects and thematic capabilities, not trained weights or proficiency scores.</p><button class="network-show-all" type="button" data-project-overview>Show entire network</button>');
  detail.classList.toggle('is-hover-preview',preview);
 }
 function updatePreview(){
  const picked=hovered||active;
  if(picked)renderDetail(picked,{preview:Boolean(hovered&&hovered!==active)});
  else renderOverview();
  draw();
 }
 function renderOverview(){
  if(renderedId===null&&detail.dataset.showingOverview==='yes')return;
  renderedId=null;renderedAsPreview=false;detail.dataset.showingOverview='yes';
  detail.classList.remove('is-hover-preview');
  detail.innerHTML=`<div class="network-focus-top"><span>PROJECT NETWORK</span><span>ALL CONNECTIONS</span></div><p class="network-focus-category">TECHNICAL MAP</p><h3>How the work connects.</h3><p class="network-focus-copy">Explore seven projects and the capabilities behind them. Hover or focus a node for an instant preview. Click to pin a selection and follow its documented paths.</p><div class="network-overview-stats"><span><strong>07</strong> Projects</span><span><strong>10</strong> Capabilities</span><span><strong>12</strong> Technologies</span></div><p class="network-overview-guide">Select any glowing node to trace its connections, or start with the computer vision system.</p><button class="network-show-all" type="button" data-project-node="scanner">Explore Scanner</button>`;
 }
 function focus(id){
  if(!byId.has(id))return;
  active=id;hovered=null;detail.dataset.showingOverview='no';
  announce.textContent=`Pinned ${byId.get(id).name}. Related connections highlighted.`;
  updatePreview();
 }
 function overview(){
  active=null;hovered=null;announce.textContent='Showing all project network connections.';
  renderOverview();draw();
 }
 shell.addEventListener('click',evt=>{const target=evt.target.closest('[data-project-node]');if(target)focus(target.dataset.projectNode)});
 mobile.addEventListener('click',evt=>{const target=evt.target.closest('[data-project-node]');if(!target)return;focus(target.dataset.projectNode);if(window.innerWidth<721)detail.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'})});
 detail.addEventListener('click',evt=>{const target=evt.target.closest('[data-project-node]');if(target)focus(target.dataset.projectNode);if(evt.target.closest('[data-project-overview]'))overview();const c=evt.target.closest('[data-case]');if(c)onShowNotes?.(c.dataset.case)});
 shell.addEventListener('pointerover',evt=>{
  if(evt.pointerType==='touch')return;
  const b=evt.target.closest('[data-project-node]');if(!b||hovered===b.dataset.projectNode)return;
  hovered=b.dataset.projectNode;detail.dataset.showingOverview='no';updatePreview();
 });
 shell.addEventListener('pointerout',evt=>{
  const b=evt.target.closest('[data-project-node]');if(!b||b.contains(evt.relatedTarget))return;
  if(hovered===b.dataset.projectNode){hovered=null;updatePreview()}
 });
 shell.addEventListener('focusin',evt=>{const b=evt.target.closest('[data-project-node]');if(b){hovered=b.dataset.projectNode;updatePreview()}});
 shell.addEventListener('focusout',evt=>{const b=evt.target.closest('[data-project-node]');if(b&&!b.contains(evt.relatedTarget)&&hovered===b.dataset.projectNode){hovered=null;updatePreview()}});
 shell.addEventListener('keydown',evt=>{
  const b=evt.target.closest('[data-project-node]');if(!b)return;
  if(evt.key==='Escape'){evt.preventDefault();overview();return;}
  if(evt.key==='Enter'||evt.key===' '){return;}
  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(evt.key))return;
  const n=byId.get(b.dataset.projectNode);if(!n)return;
  let next=null;
  if(evt.key==='ArrowUp'||evt.key==='ArrowDown'){
   const candidates=nodesForLayer(n.layer),i=candidates.findIndex(x=>x.id===n.id);
   next=candidates[(i+(evt.key==='ArrowDown'?1:-1)+candidates.length)%candidates.length];
  }else{
   const candidates=[...(adjacent.get(n.id)||[])].map(id=>byId.get(id)).filter(x=>evt.key==='ArrowRight'?x.layer>n.layer:x.layer<n.layer);
   next=candidates.sort((a,b)=>Math.abs(a.y-n.y)-Math.abs(b.y-n.y))[0];
  }
  if(next){evt.preventDefault();shell.querySelector(`[data-project-node="${next.id}"]`)?.focus()}
 });
 motionButton?.addEventListener('click',()=>{if(reduced())return;motionEnabled=!motionEnabled;draw()});
 resetButton?.addEventListener('click',()=>overview());
 let obs=null,visibility=null;
 function resize(){const scale=Math.min(1,fit.getBoundingClientRect().width/1000);fit.style.height=`${HEIGHT*scale}px`;fit.style.setProperty('--network-scale',String(scale))}
 if('ResizeObserver' in window){obs=new ResizeObserver(resize);obs.observe(fit)}
 if('IntersectionObserver' in window){visibility=new IntersectionObserver(entries=>{network.classList.toggle('network-offscreen',!entries[0].isIntersecting)},{rootMargin:'80px'});visibility.observe(network)}
 if(window.matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)').matches){
  fit.addEventListener('pointermove',evt=>{const r=fit.getBoundingClientRect();fit.style.setProperty('--graph-yaw',`${((evt.clientX-r.left)/r.width-.5)*2}deg`);fit.style.setProperty('--graph-pitch',`${((evt.clientY-r.top)/r.height-.5)*-1.3}deg`)});
  fit.addEventListener('pointerleave',()=>{fit.style.setProperty('--graph-yaw','0deg');fit.style.setProperty('--graph-pitch','0deg')});
 }
 render();resize();overview();
 return {focus,overview,destroy(){obs?.disconnect();visibility?.disconnect()}};
}
