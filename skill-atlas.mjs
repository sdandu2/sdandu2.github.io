/** M6.22 — Evidence-scoped, seven-layer portfolio skill atlas.
 * Project paths are editorial associations supported by the seven supplied
 * portfolio descriptions; not a skill ranking, causal graph, or job claim.
 * The original 29-node projectGraph remains in project-network.mjs for audit.
 */
import {projects} from './data.mjs';
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const atlasLayers=[
 {title:'Projects',short:'Projects',note:'Seven documented builds'},
 {title:'Disciplines',short:'Fields',note:'Technical focus areas'},
 {title:'Techniques',short:'Methods',note:'Specific engineering approaches'},
 {title:'Math & evaluation',short:'Math',note:'Measured or modeled concepts'},
 {title:'Languages',short:'Languages',note:'Code used in project work'},
 {title:'Tools & platforms',short:'Tools',note:'Libraries and infrastructure'},
 {title:'Soft skills / practices',short:'Soft skills',note:'Evidence-based ways of working'}
];
// Each entry is an evidence-bounded concept, not a proficiency claim.
const definitions=[
[1,'sys','Systems engineering','Building components whose behavior is predictable and testable.'],
[1,'vision','Computer vision','Inspecting product imagery through features and anomaly scores.'],
[1,'retrieval','Information retrieval','Finding research beyond exact keyword matches.'],
[1,'data','Data engineering','Collecting records with consistent identity and timestamps.'],
[1,'ml','ML evaluation','Measuring model behavior on held-out test material.'],
[1,'quantum','Quantum simulation','Testing circuits and network behavior using simulators.'],
[1,'quant','Quantitative modeling','Exploring trading mechanisms and simulated outcomes.'],
[2,'matching','Price–time matching','Deterministic matching according to order price and arrival time.'],
[2,'benchmark','Performance benchmarking','Timing the matching engine separately from its surrounding system.'],
[2,'embeddings','Visual feature extraction','Using pretrained image features to compare unfamiliar samples.'],
[2,'anomaly','PatchCore-style anomaly scoring','Comparing image regions against normal reference examples.'],
[2,'frozen','Frozen evaluation','Rechecking held-out decisions without changing thresholds.'],
[2,'semantic','Semantic retrieval','Retrieving documents when query and paper wording differ.'],
[2,'reranking','Search reranking','Ordering retrieved candidates by evidence relevance.'],
[2,'ingestion','Timestamped ingestion','Collecting transit snapshots with capture-time context.'],
[2,'interfaces','Data-backed interfaces','Exposing analysis through interactive search, maps or inspection views.'],
[2,'qaoa','QAOA circuit design','Studying circuit depth for simulated Max-Cut optimization.'],
[2,'noise','Noise simulation','Testing quantum circuits under simulated hardware noise.'],
[2,'sequences','Sequence forecasting','Predicting delivered-pair counts from simulation runs.'],
[2,'shifts','Shift evaluation','Testing forecasting results under changing simulation conditions.'],
[2,'scenarios','Scenario generation','Exploring market outcomes under alternative assumptions.'],
[3,'priority','Ordering rules','Price–time priority as an explicit, testable rule.'],
[3,'throughput','Throughput','Engine-only operations per second on a recorded workload.'],
[3,'auroc','Classification metrics · AUROC','AUROC, average precision and held-out defect evaluation.'],
[3,'ndcg','Ranking quality · nDCG@10','nDCG@10 for held-out paper retrieval.'],
[3,'timestamps','Time and counts','Separating captured observations from simultaneous live vehicles.'],
[3,'maxcut','Combinatorial optimization','Small graph Max-Cut problems used in QAOA simulation.'],
[3,'gatebudget','Gate-budget trade-offs','Weighing additional circuit depth against noisy simulation cost.'],
[3,'mae','Forecasting error · MAE','Mean absolute error measured on complete simulation runs.'],
[3,'interval','Uncertainty analysis','Accounting for whether a small performance difference is conclusive.'],
[3,'outcomes','Scenario distributions','Exploring a range of simulated outcomes rather than verified forecasts.'],
[4,'cpp','C++20','Core language for ExchangeCore order matching.'],
[4,'python','Python','Used for data processing, experimentation and backend work.'],
[4,'typescript','TypeScript','Used with React for the TransitPulse frontend.'],
[5,'cmake','CMake','Build configuration for the C++ matching engine.'],
[5,'pytorch','PyTorch','ML experiments in Scanner and SimShift-Q.'],
[5,'dinov2','DINOv2','Pretrained vision feature backbone in Scanner.'],
[5,'streamlit','Streamlit','Inspection interface used in Scanner.'],
[5,'react','React','Interactive frontend technology across selected projects.'],
[5,'fastapi','FastAPI','Data and search APIs in EvidenceSearch and TransitPulse.'],
[5,'postgres','PostgreSQL','Storage for recorded TransitPulse vehicle observations.'],
[5,'qiskit','Qiskit','Quantum circuit creation and controlled optimization experiments.'],
[5,'aer','Qiskit Aer','Noise-aware quantum circuit simulation.'],
[5,'notebooks','Research notebooks','Repeatable local analysis and simulation workflows.'],
[6,'repeatable','Reproducibility','Preserving fixed test conditions and checking outputs again.'],
[6,'explain','Clear communication','Explaining what a score or graph does—and does not—show.'],
[6,'users','User perspective','Designing results around what someone needs to understand.'],
[6,'tradeoffs','Trade-off reasoning','Comparing simpler baselines with more complex approaches.'],
[6,'skepticism','Critical evaluation','Keeping claims smaller than the evidence available.'],
[6,'iterate','Iterative problem-solving','Refining implementation and evaluation through experiments.']
];
const id=(short)=>`skill-${short}`;
const rawNodes=[...projects.map(p=>({id:p.id,title:p.name,layer:0,description:p.description,project:p})),...definitions.map(([layer,key,title,description])=>({id:id(key),title,layer,description}))];
// Every path is scoped to one project and contains exactly one node per layer.
// Edges mean concepts appear in the same supported project story; do not
// imply an employer's technology inventory or one skill causing the next.
export const atlasRoutes={
 exchangecore:[
  ['sys','matching','priority','cpp','cmake','repeatable'],
  ['quant','benchmark','throughput','cpp','cmake','tradeoffs'],
  ['sys','interfaces','throughput','python','react','users']
 ],
 scanner:[
  ['vision','embeddings','auroc','python','dinov2','iterate'],
  ['vision','anomaly','auroc','python','pytorch','skepticism'],
  ['ml','frozen','auroc','python','streamlit','repeatable']
 ],
 evidencesearch:[
  ['retrieval','semantic','ndcg','python','fastapi','explain'],
  ['retrieval','reranking','ndcg','python','react','skepticism'],
  ['ml','interfaces','ndcg','python','react','users']
 ],
 transitpulse:[
  ['data','ingestion','timestamps','python','postgres','repeatable'],
  ['data','interfaces','timestamps','typescript','react','users'],
  ['sys','ingestion','timestamps','python','fastapi','explain']
 ],
 quantumoptlab:[
  ['quantum','qaoa','maxcut','python','qiskit','iterate'],
  ['quantum','noise','gatebudget','python','aer','tradeoffs'],
  ['ml','frozen','gatebudget','python','notebooks','skepticism']
 ],
 'simshift-q':[
  ['quantum','sequences','mae','python','pytorch','repeatable'],
  ['ml','shifts','interval','python','notebooks','skepticism'],
  ['quantum','shifts','mae','python','pytorch','tradeoffs']
 ],
 financialscenarios:[
  ['quant','scenarios','outcomes','python','notebooks','explain'],
  ['quant','interfaces','outcomes','python','notebooks','users'],
  ['ml','scenarios','interval','python','notebooks','skepticism']
 ]
};
// Financial-scene uncertainty is qualitative; uncertainty intervals belong to
// SimShift-Q, not the financial prototype. Preserve a project-safe link to
// scenario distributions rather than claiming financial interval calibration.
atlasRoutes.financialscenarios[2][2]='outcomes';
export const atlasPaths=Object.entries(atlasRoutes).flatMap(([project,rows])=>rows.map(row=>[project,...row.map(id)]));
const evidence=new Map(rawNodes.map(n=>[n.id,new Set()]));
const edgeEvidence=new Map();
for(const path of atlasPaths){
 for(const node of path)evidence.get(node)?.add(path[0]);
 for(let i=0;i<path.length-1;i++){
  const key=path[i]+'|'+path[i+1];
  if(!edgeEvidence.has(key))edgeEvidence.set(key,new Set());
  edgeEvidence.get(key).add(path[0]);
 }
}
export const atlasGraph={
 nodes:rawNodes.map(n=>({...n,projects:[...evidence.get(n.id)]})),
 edges:[...edgeEvidence].map(([key,support])=>({from:key.split('|')[0],to:key.split('|')[1],projects:[...support]}))
};
const nodeById=new Map(atlasGraph.nodes.map(n=>[n.id,n]));
export function traceSkillAtlas(selected=null){
 const allIds=new Set(atlasGraph.nodes.map(n=>n.id));
 const allEdges=new Set(atlasGraph.edges.map(e=>e.from+'|'+e.to));
 if(!selected||!nodeById.has(selected))return {nodeIds:allIds,edgeKeys:allEdges,projects:[]};
 const node=nodeById.get(selected);
 const relatedProjects=node.layer===0?[node.id]:node.projects;
 const keys=new Set(atlasGraph.edges.filter(e=>e.projects.some(p=>relatedProjects.includes(p))).map(e=>e.from+'|'+e.to));
 const activeIds=new Set(atlasGraph.nodes.filter(n=>n.layer===0?relatedProjects.includes(n.id):n.projects.some(p=>relatedProjects.includes(p))).map(n=>n.id));
 return {nodeIds:activeIds,edgeKeys:keys,projects:relatedProjects};
}
const w=224, gap=26, span=w+gap, height=912, top=72, pad=44;
function layoutFor(layer,index,length){
 const usable=height-top-pad;
 return {x:layer*span+14,y:top+usable*(index+.5)/length};
}
function mountLegacySkillAtlas({onShowNotes}={}){
 const stage=document.getElementById('project-graphic');
 if(!stage)return null;
 const viewport=document.getElementById('skill-atlas-viewport');
 const svg=document.getElementById('project-connections');
 const panel=document.getElementById('project-focus');
 const mobile=document.getElementById('project-mobile');
 const tabs=document.getElementById('skill-layer-tabs');
 const search=document.getElementById('skill-atlas-search');
 const previous=document.getElementById('skill-layer-previous');
 const next=document.getElementById('skill-layer-next');
 const reset=document.getElementById('project-reset-network');
 const motion=document.getElementById('project-motion-toggle');
 const readout=document.getElementById('project-signal-readout');
 const status=document.getElementById('skill-atlas-status');
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const positions=new Map();
 const width=atlasLayers.length*span+10;
 let active=null,hovered=null,query='',layer=0,signals=!reduced();
 const grouped=atlasLayers.map((_,i)=>atlasGraph.nodes.filter(n=>n.layer===i));
 grouped.forEach((list,i)=>list.forEach((n,k)=>positions.set(n.id,layoutFor(i,k,list.length))));
 tabs.innerHTML=atlasLayers.map((l,i)=>`<button type="button" data-skill-layer="${i}" aria-pressed="${i===0}"><span class="skill-tab-num">0${i+1}</span>${escapeHtml(l.short)}</button>`).join('');
 function fitTrack(){
  const track=viewport.querySelector('.skill-atlas-canvas');
  if(track)track.style.width=`${width+Math.max(0,viewport.clientWidth-span)}px`;
 }
 function render(){
  stage.style.width=`${width}px`;stage.style.height=`${height}px`;
  fitTrack();
  stage.innerHTML=atlasGraph.nodes.map(n=>{
   const p=positions.get(n.id);return `<button type="button" class="skill-node" style="left:${p.x}px;top:${p.y}px" data-skill-id="${escapeHtml(n.id)}" aria-pressed="false" aria-label="Explore ${escapeHtml(n.title)}"><span class="skill-node-index">${String(n.layer+1).padStart(2,'0')}</span><span class="skill-node-title">${escapeHtml(n.title)}</span><small>${escapeHtml(atlasLayers[n.layer].short)}</small></button>`;
  }).join('');
  const rail=document.getElementById('skill-atlas-columns');
  rail.style.width=`${width}px`;rail.style.height=`${height}px`;
  rail.innerHTML=atlasLayers.map((l,i)=>`<div class="skill-column" style="left:${i*span}px;width:${w+10}px"><span>0${i+1} / ${escapeHtml(l.title)}</span><small>${escapeHtml(l.note)}</small></div>`).join('');
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.style.width=`${width}px`;svg.style.height=`${height}px`;
  const defs='<defs><linearGradient id="skillLine" x1="0" x2="1"><stop stop-color="#247293"/><stop offset="1" stop-color="#6bc5f7"/></linearGradient></defs>';
  svg.innerHTML=defs+atlasGraph.edges.map((edge,i)=>{
   const a=positions.get(edge.from),b=positions.get(edge.to);
   const x=a.x+w-15,xx=b.x-5;
   const path=`M${x},${a.y} C${x+27},${a.y} ${xx-27},${b.y} ${xx},${b.y}`;
   return `<path class="skill-edge" data-skill-edge="${escapeHtml(edge.from+'|'+edge.to)}" d="${path}" style="--edge-delay:-${i%17*.33}s"/>`;
  }).join('');
  mobile.innerHTML=grouped.map((nodes,i)=>`<details class="skill-mobile-group" data-skill-mobile-layer="${i}" ${i===0?'open':''}><summary>0${i+1} / ${escapeHtml(atlasLayers[i].title)} <span>${nodes.length} topics</span></summary><div>${nodes.map(n=>`<button type="button" data-skill-id="${escapeHtml(n.id)}">${escapeHtml(n.title)}</button>`).join('')}</div></details>`).join('');
 }
 function clearOverview(){
  panel.innerHTML=`<div class="network-focus-top"><span>SKILL ATLAS / OVERVIEW</span><span>SEVEN LAYERS</span></div><p class="network-focus-category">A MAP OF DOCUMENTED WORK</p><h3>Explore the work behind the skills.</h3><p class="network-focus-copy">Follow seven projects across the techniques, mathematics and software tools used to build them. Select any node to see which projects support that connection.</p><div class="skill-overview-number"><strong>${atlasGraph.nodes.length}</strong><span>connected topics</span><strong>${atlasLayers.length}</strong><span>distinct layers</span></div><p class="skill-proof-note">Connections represent concepts appearing together in a documented portfolio project. They do not measure proficiency, imply a causal dependency, or claim experience with an employer's private technology stack.</p><button type="button" class="skill-explore-start" data-skill-id="scanner">Start with Scanner</button>`;
 }
 function renderDetail(id){
  const n=nodeById.get(id);if(!n)return clearOverview();
  const supports=n.layer===0?[n.id]:n.projects;
  const refs=supports.map(k=>projects.find(p=>p.id===k)).filter(Boolean);
  const proofButtons=refs.map(p=>`<button type="button" data-skill-id="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`).join('');
  const nextNodes=atlasGraph.nodes.filter(other=>other.layer===n.layer+1&&other.projects.some(p=>supports.includes(p)));
  const nextButtons=nextNodes.slice(0,7).map(o=>`<button type="button" data-skill-id="${escapeHtml(o.id)}">${escapeHtml(o.title)}</button>`).join('');
  const p=n.project;
  panel.innerHTML=`<div class="network-focus-top"><span>0${n.layer+1} / ${escapeHtml(atlasLayers[n.layer].title.toUpperCase())}</span><span>SELECTED</span></div><p class="network-focus-category">${p?escapeHtml(p.kind):'EVIDENCED THROUGH PORTFOLIO WORK'}</p><h3>${escapeHtml(n.title)}</h3><p class="network-focus-copy">${escapeHtml(p?({exchangecore:'An engine-only C++ matching benchmark and its deterministic rules.',scanner:'Visual anomaly inspection, evaluated on held-out product images.',evidencesearch:'Research retrieval across multiple domains, measured on a held-out ranking task.',transitpulse:'Timestamped transit observations exposed through a map and API.',quantumoptlab:'QAOA circuit experiments on small simulated Max-Cut problems.', 'simshift-q':'Forecasting delivered entangled pairs under simulated network shift.',financialscenarios:'A local prototype for exploring simulated market outcome ranges.'}[p.id]):n.description)}</p>${p?`<div class="network-focus-result network-focus-result-compact"><strong>${escapeHtml(p.result)}</strong><span>${escapeHtml(p.resultLabel)}</span></div><img class="skill-project-art" loading="lazy" src="${escapeHtml(p.image)}" alt="Concept artwork for ${escapeHtml(p.name)}">`:''}<div class="network-focus-links"><strong>${p?'PROJECT EVIDENCE':'SUPPORTED BY THESE PROJECTS'}</strong><div>${proofButtons}</div></div>${nextButtons?`<div class="network-focus-links"><strong>NEXT LAYER / RELATED SKILLS</strong><div>${nextButtons}</div></div>`:''}${p?`<div class="project-network-actions"><button type="button" class="project-network-case" data-skill-case="${escapeHtml(p.id)}">Engineering notes</button>${p.repo?`<a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer">Repository</a>`:''}</div>`:''}<p class="skill-proof-note">${n.layer===6?'Working practices are interpretations grounded in project descriptions, not independently verified interpersonal ratings.':'Curated project-to-skill association; not a test of proficiency or evidence of a proprietary employer stack.'}</p><button type="button" data-skill-clear class="network-show-all">Show full atlas</button>`;
 }
 function draw(){
  const picked=hovered||active;
  const trace=traceSkillAtlas(picked);
  const matched=new Set(atlasGraph.nodes.filter(n=>!query||[n.title,n.description].some(text=>text.toLowerCase().includes(query))).map(n=>n.id));
  stage.querySelectorAll('[data-skill-id]').forEach(el=>{
   const id=el.dataset.skillId;
   el.classList.toggle('is-selected',id===active);el.classList.toggle('is-related',Boolean(picked)&&trace.nodeIds.has(id));
   el.classList.toggle('is-muted',Boolean(picked)&&!trace.nodeIds.has(id));el.classList.toggle('is-search-dim',Boolean(query)&&!matched.has(id));
   el.setAttribute('aria-pressed',String(id===active));
  });
  mobile.querySelectorAll('[data-skill-id]').forEach(el=>{el.classList.toggle('is-selected',el.dataset.skillId===active);el.hidden=Boolean(query)&&!matched.has(el.dataset.skillId)});
  svg.querySelectorAll('path[data-skill-edge]').forEach(el=>{
   el.classList.toggle('is-related',Boolean(picked)&&trace.edgeKeys.has(el.dataset.skillEdge));
   el.classList.toggle('is-muted',Boolean(picked)&&!trace.edgeKeys.has(el.dataset.skillEdge));
  });
  reset.disabled=!active&&!query;
  readout.textContent=picked?`${trace.projects.length} supported project${trace.projects.length===1?'':'s'} · ${trace.nodeIds.size} connected topics`:`${atlasGraph.nodes.length} topics · ${atlasGraph.edges.length} curated paths`;
  const found=matched.size;
  status.textContent=query?`${found} matching topic${found===1?'':'s'}`:`Layer ${layer+1} of ${atlasLayers.length}: ${atlasLayers[layer].title}`;
  tabs.querySelectorAll('[data-skill-layer]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.skillLayer)===layer)));
  previous.disabled=layer===0;next.disabled=layer===atlasLayers.length-1;
  viewport.classList.toggle('is-signals-paused',!signals||reduced());
  motion.setAttribute('aria-pressed',String(signals&&!reduced()));motion.textContent=signals&&!reduced()?'Pause signals':'Play signals';
  motion.disabled=reduced();
 }
 function focus(id,{scroll=false}={}){
  if(!nodeById.has(id))return;
  active=id;hovered=null;renderDetail(id);
  if(scroll){const n=nodeById.get(id);gotoLayer(n.layer);if(matchMedia('(max-width:850px)').matches){const group=mobile.querySelector(`[data-skill-mobile-layer="${n.layer}"]`);group.open=true;}}
  draw();
 }
 function gotoLayer(index){
  layer=Math.max(0,Math.min(6,index));
  viewport.scrollTo({left:Math.max(0,layer*span+w/2-viewport.clientWidth/2),behavior:'instant'});
  const group=mobile.querySelector(`[data-skill-mobile-layer="${layer}"]`);
  if(group){group.open=true;}
  draw();
 }
 function showAll(){active=null;hovered=null;query='';search.value='';clearOverview();draw();}
 stage.addEventListener('click',e=>{const b=e.target.closest('[data-skill-id]');if(b)focus(b.dataset.skillId)});
 stage.addEventListener('pointerover',e=>{const b=e.target.closest('[data-skill-id]');if(b&&b.dataset.skillId!==hovered){hovered=b.dataset.skillId;draw();}});
 stage.addEventListener('pointerout',e=>{const b=e.target.closest('[data-skill-id]');if(b&&!b.contains(e.relatedTarget)){hovered=null;draw();}});
 stage.addEventListener('focusin',e=>{const b=e.target.closest('[data-skill-id]');if(b){hovered=b.dataset.skillId;draw();}});
 stage.addEventListener('focusout',e=>{if(e.target.closest('[data-skill-id]')){hovered=null;draw();}});
 mobile.addEventListener('click',e=>{const b=e.target.closest('[data-skill-id]');if(b)focus(b.dataset.skillId)});
 panel.addEventListener('click',e=>{
  const b=e.target.closest('[data-skill-id]');if(b)focus(b.dataset.skillId,{scroll:true});
  const caseButton=e.target.closest('[data-skill-case]');if(caseButton)onShowNotes?.(caseButton.dataset.skillCase);
  if(e.target.closest('[data-skill-clear]'))showAll();
 });
 tabs.addEventListener('click',e=>{const b=e.target.closest('[data-skill-layer]');if(b)gotoLayer(Number(b.dataset.skillLayer));});
 previous.addEventListener('click',()=>gotoLayer(layer-1));next.addEventListener('click',()=>gotoLayer(layer+1));
 // Tabs are authoritative when jumping; free scrolling does not steal focus
 // or unexpectedly switch the user's selected category.

 viewport.addEventListener('keydown',e=>{if(e.target.closest('button'))return;if(e.key==='ArrowRight'){e.preventDefault();gotoLayer(layer+1)}else if(e.key==='ArrowLeft'){e.preventDefault();gotoLayer(layer-1)}else if(e.key==='Escape')showAll();});
 search.addEventListener('input',()=>{query=search.value.trim().toLowerCase();draw()});
 search.addEventListener('keydown',e=>{if(e.key==='Enter'){const n=query&&(atlasGraph.nodes.find(n=>n.title.toLowerCase().includes(query))||atlasGraph.nodes.find(n=>n.description.toLowerCase().includes(query)));if(n){e.preventDefault();focus(n.id,{scroll:true});}}else if(e.key==='Escape'){showAll();search.blur();}});
 reset.addEventListener('click',showAll);
 motion.addEventListener('click',()=>{signals=!signals;draw();});
 const onResize=()=>{fitTrack();viewport.scrollLeft=Math.max(0,layer*span+w/2-viewport.clientWidth/2)};
 window.addEventListener('resize',onResize);
 render();clearOverview();draw();
 return {focus:(id)=>focus(id,{scroll:true}),showAll,destroy(){window.removeEventListener('resize',onResize)}};
}

// M6.24 routes the public interface to the expanded six-column visual.
import {mountSkillNetwork} from "./skill-network-v3.mjs";
export const mountSkillAtlas=mountSkillNetwork;
