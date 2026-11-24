/** Career knowledge graph — separate from the seven-project helix.
 * The four roles and their outcomes come from the supplied resume.
 * Experience -> capability edges are supported by role descriptions;
 * capability -> language/tool edges are contextual relationships, NOT
 * assertions about which technologies a particular employer used.
 * No invented numeric weights, proficiency scores, or causal links.
 */
const roleNodes = [
  {id:'teckpulse',layer:0,y:153,short:'TeckPulse',name:'TeckPulse',meta:'2025–2026 · MACHINE LEARNING INTERN',description:'I worked on deep-learning models, an NLP classification pipeline, and the training systems needed to iterate on those models efficiently.',metric:'30 → 10 min',metricLabel:'per recorded training epoch',context:'Specific to the documented training workflow, not a general speedup claim.',points:['Improved computer-vision F1 by 8–12% over baseline models.','Reduced NLP inference latency by 25% and added API/testing work with more than 85% test coverage.'],keywords:['Python','PyTorch','TensorFlow','NLP','Batching','REST APIs']},
  {id:'komatsu',layer:0,y:340,short:'Komatsu',name:'Komatsu North America',meta:'2024–2025 · DATA ANALYST CO-OP',description:'I brought separate operational datasets together, built reporting pipelines, and analyzed equipment telemetry to make decisions easier to validate.',metric:'45% less',metricLabel:'time spent on weekly reporting',context:'Reported outcome of the five-source KPI workflow.',points:['Used regression and feature engineering to identify nine cost drivers and reduce forecast variance by 15%.','Telemetry anomaly detection flagged failures 2–3 days earlier in the reported workflow.'],keywords:['Python','KPI reporting','Feature engineering','Regression','Anomaly detection']},
  {id:'uic',layer:0,y:525,short:'UIC Research',name:'University of Illinois Chicago',meta:'2023–2024 · RESEARCH ASSISTANT',description:'I compared computer-vision and NLP approaches while making experimental pipelines more reproducible and faster to run.',metric:'50% less',metricLabel:'experiment turnaround time',context:'Reported for the research workflow; not a general training benchmark.',points:['Compared three deep-learning architectures and reported a 7% benchmark improvement.','Built Python/C++ GPU-assisted workflows and investigated model-size versus accuracy trade-offs.'],keywords:['Python','C++','GPU computing','Computer vision','NLP','Reproducibility']},
  {id:'ensar',layer:0,y:710,short:'Ensar Solutions',name:'Ensar Solutions',meta:'2023 · DATA SCIENCE INTERN',description:'I evaluated a medical-image classifier, worked with large structured datasets, and explored reinforcement learning for decision optimization.',metric:'200K+',metricLabel:'structured records handled',context:'Resume-reported data volume; the clinical prototype was research work, not a deployed medical tool.',points:['Improved reported CNN AUC by 8% and reduced false positives by 18%.','Built a reinforcement-learning prototype reporting 10–20% higher reward than a heuristic baseline.'],keywords:['CNN','Image processing','ETL','Q-learning','Policy gradients','Data validation']}
];
const capabilityNodes = [
  {id:'training',layer:1,y:88,short:'Training & parallelism',name:'Training optimization',meta:'CAPABILITY / PERFORMANCE',description:'Accelerating iteration by profiling data loading, batching and parallel execution.',points:['TeckPulse training speedup is documented.','GPU/parallel research also appears in the UIC role.'],keywords:['Multiprocessing','Data loaders','GPU computing']},
  {id:'vision',layer:1,y:162,short:'Computer vision',name:'Computer vision',meta:'CAPABILITY / AI',description:'Designing and evaluating visual classifiers and comparing architecture choices.',points:['TeckPulse, UIC and Ensar include vision work.','Scanner is a separate portfolio example of anomaly detection.'],keywords:['CNNs','Image processing','F1','AUC']},
  {id:'nlp',layer:1,y:236,short:'NLP & embeddings',name:'NLP and embeddings',meta:'CAPABILITY / AI',description:'From text preprocessing and embeddings to classification and evaluation.',points:['TeckPulse reports NLP precision and latency improvements.','UIC included experiments across vision and NLP architectures.'],keywords:['Tokenization','Embeddings','Classification','Batching']},
  {id:'pipelines',layer:1,y:310,short:'Data pipelines',name:'Data engineering and ETL',meta:'CAPABILITY / DATA',description:'Integrating datasets, validating records and making repeatable transformations.',points:['Komatsu brought together five data sources.','Ensar processed more than 200,000 structured records.'],keywords:['ETL','Data validation','Pipelines','Audit logs']},
  {id:'statistics',layer:1,y:384,short:'Statistics & models',name:'Statistical modeling',meta:'CAPABILITY / ANALYTICS',description:'Using data to measure uncertainty, test hypotheses and quantify business drivers.',points:['Komatsu used feature engineering and regression.','Resume lists confidence intervals and nonparametric/statistical tests.'],keywords:['Regression','A/B testing','Confidence intervals','Mann–Whitney U','Chi-square']},
  {id:'anomaly',layer:1,y:458,short:'Anomaly detection',name:'Anomaly detection',meta:'CAPABILITY / MONITORING',description:'Finding departures from expected behavior and validating alert outcomes.',points:['Komatsu applied anomaly detection to equipment telemetry.','Scanner investigates defects on held-out industrial images.'],keywords:['Telemetry','Monitoring','Validation']},
  {id:'evaluation',layer:1,y:532,short:'Evaluation & testing',name:'Model evaluation and testing',meta:'CAPABILITY / QUALITY',description:'Comparing metrics, baselines and failure cases before trusting a model result.',points:['TeckPulse and UIC report model comparisons.','Ensar evaluated false positives and AUC.'],keywords:['F1 score','AUC','Precision','Unit tests','Integration tests']},
  {id:'research',layer:1,y:606,short:'Reproducible ML',name:'Reproducible ML research',meta:'CAPABILITY / EXPERIMENTS',description:'Keeping experiment settings and results repeatable enough to inspect and challenge.',points:['UIC role included GPU-backed reproducible training pipelines.','Portfolio projects use held-out evaluation and recorded benchmarks.'],keywords:['Experiment tracking','Git','Jupyter','GPU']},
  {id:'reinforcement',layer:1,y:680,short:'Reinforcement learning',name:'Reinforcement learning',meta:'CAPABILITY / DECISIONS',description:'Exploring reward-driven control with policy-gradient and Q-learning methods.',points:['Ensar includes an RL prototype compared against a heuristic baseline.'],keywords:['Q-learning','Policy gradients','Baseline comparisons']},
  {id:'services',layer:1,y:754,short:'APIs & MLOps',name:'ML services and reliability',meta:'CAPABILITY / SOFTWARE',description:'Packaging model work behind configurable APIs, logging and automated tests.',points:['TeckPulse lists service APIs, logging and unit/integration coverage.','Broader Docker and workflow-tool knowledge is listed on the resume, not tied here to an employer.'],keywords:['REST APIs','Logging','Testing','Docker','Airflow']}
];
const languages = [
  {id:'python',layer:2,y:105,short:'Python',name:'Python',meta:'LANGUAGE / PROFESSIONAL + PORTFOLIO',description:'The main language in the supplied professional and portfolio work: ML training, experimentation and data processing.',keywords:['TeckPulse','Komatsu','UIC','Scanner','EvidenceSearch']},
  {id:'cpp',layer:2,y:198,short:'C++',name:'C++',meta:'LANGUAGE / PROFESSIONAL + PORTFOLIO',description:'The resume describes C++ in UIC research and the ExchangeCore matching engine.',keywords:['UIC research','ExchangeCore','Systems programming']},
  {id:'sql',layer:2,y:291,short:'SQL',name:'SQL',meta:'LANGUAGE / RESUME SKILL',description:'A listed data/query language, relevant to analytics and structured data. The graph does not claim use in any named internship.',keywords:['Relational data','Analytics']},
  {id:'r',layer:2,y:384,short:'R',name:'R',meta:'LANGUAGE / RESUME SKILL',description:'Listed on the resume as a language in the broader quantitative-analysis toolkit; no specific employer claim.',keywords:['Statistics','Data analysis']},
  {id:'java',layer:2,y:477,short:'Java',name:'Java',meta:'LANGUAGE / RESUME SKILL',description:'Listed on the resume as a general-purpose programming language. No specific employer connection is asserted.',keywords:['General-purpose programming']},
  {id:'typescript',layer:2,y:570,short:'TypeScript',name:'TypeScript',meta:'LANGUAGE / PORTFOLIO',description:'Listed on the resume and demonstrated by interactive frontend work such as TransitPulse; not mapped to an employer.',keywords:['Frontend','TransitPulse'],project:'transitpulse'},
  {id:'kotlin',layer:2,y:663,short:'Kotlin',name:'Kotlin',meta:'LANGUAGE / RESUME SKILL',description:'Listed on the resume; a role-level use case was not supplied, so no professional link is invented.',keywords:['Mobile development']},
  {id:'swift',layer:2,y:756,short:'Swift',name:'Swift',meta:'LANGUAGE / RESUME SKILL',description:'Listed on the resume; no employer-specific implementation claim is made.',keywords:['Mobile development']}
];
const tools = [
  {id:'pytorch',layer:2,y:68,short:'PyTorch',name:'PyTorch',meta:'FRAMEWORK / DOCUMENTED WORK',description:'Deep-learning training framework explicitly used in TeckPulse work and additional portfolio ML projects.',keywords:['Neural networks','Computer vision','Model training']},
  {id:'tensorflow',layer:2,y:137,short:'TensorFlow',name:'TensorFlow',meta:'FRAMEWORK / DOCUMENTED WORK',description:'Neural-network toolkit listed for TeckPulse and on-device AI work.',keywords:['Deep learning','Vision']},
  {id:'sklearn',layer:2,y:206,short:'scikit-learn',name:'scikit-learn',meta:'ML LIBRARY / RESUME SKILL',description:'Listed in the broader ML toolkit for conventional models, preprocessing and evaluation.',keywords:['Baselines','Classification','Evaluation']},
  {id:'pandas',layer:2,y:275,short:'pandas',name:'pandas',meta:'DATA LIBRARY / RESUME SKILL',description:'Tabular data processing library listed in the resume; a specific employer dependency is not asserted.',keywords:['Data frames','ETL','Analytics']},
  {id:'numpy',layer:2,y:344,short:'NumPy',name:'NumPy',meta:'NUMERICAL LIBRARY / RESUME SKILL',description:'Numerical array computing library listed in the resume, useful across vectorized ML and scientific experiments.',keywords:['Vectorization','Linear algebra']},
  {id:'jupyter',layer:2,y:413,short:'Jupyter',name:'Jupyter',meta:'RESEARCH TOOL / RESUME SKILL',description:'Notebook environment for inspectable analysis and reproducible experiments.',keywords:['Research notebooks','Exploration']},
  {id:'git',layer:2,y:482,short:'Git',name:'Git',meta:'DEVELOPER TOOL / RESUME SKILL',description:'Version control used throughout the public portfolio repositories.',keywords:['Source history','Reproducibility']},
  {id:'docker',layer:2,y:551,short:'Docker',name:'Docker',meta:'PLATFORM / RESUME SKILL',description:'Containerization tooling listed on the resume and used in personal infrastructure projects; not attributed to a specific employer.',keywords:['Containers','Reproducibility']},
  {id:'airflow',layer:2,y:620,short:'Airflow',name:'Apache Airflow',meta:'WORKFLOW TOOL / RESUME SKILL',description:'Workflow scheduling/orchestration tool listed on the resume; no employer use is asserted.',keywords:['Pipelines','Scheduling']},
  {id:'rest',layer:2,y:689,short:'REST APIs',name:'REST APIs',meta:'SOFTWARE PRACTICE / DOCUMENTED WORK',description:'Service/API design is described directly in the TeckPulse role; FastAPI is used in separate portfolio work.',keywords:['Services','Testing','Integration']},
  {id:'qiskit',layer:2,y:758,short:'Qiskit',name:'Qiskit',meta:'QUANTUM TOOL / PORTFOLIO',description:'Used in QuantumOptLab and listed in the resume. It is deliberately not connected to an employer.',keywords:['QAOA','Circuit simulation','QuantumOptLab'],project:'quantumoptlab'}
];
const roleEdges=[
 ['teckpulse','training'],['teckpulse','vision'],['teckpulse','nlp'],['teckpulse','evaluation'],['teckpulse','services'],
 ['komatsu','pipelines'],['komatsu','statistics'],['komatsu','anomaly'],
 ['uic','vision'],['uic','nlp'],['uic','evaluation'],['uic','research'],['uic','training'],
 ['ensar','vision'],['ensar','pipelines'],['ensar','evaluation'],['ensar','reinforcement']
];
const technologyEdges={
 languages:[
  ['training','python'],['training','cpp'],['vision','python'],['nlp','python'],['pipelines','python'],['pipelines','sql'],['pipelines','r'],['statistics','python'],['statistics','sql'],['statistics','r'],['anomaly','python'],['evaluation','python'],['evaluation','r'],['research','python'],['research','cpp'],['reinforcement','python'],['services','python'],['services','typescript']
 ],
 tools:[
  ['training','pytorch'],['training','tensorflow'],['training','numpy'],['vision','pytorch'],['vision','tensorflow'],['vision','sklearn'],['nlp','pytorch'],['nlp','tensorflow'],['nlp','numpy'],['pipelines','pandas'],['pipelines','airflow'],['pipelines','numpy'],['statistics','pandas'],['statistics','numpy'],['statistics','sklearn'],['anomaly','sklearn'],['anomaly','pandas'],['evaluation','sklearn'],['evaluation','jupyter'],['research','jupyter'],['research','git'],['research','docker'],['reinforcement','pytorch'],['services','rest'],['services','docker'],['services','git']
 ]
};
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const layerLabels=['PROFESSIONAL EXPERIENCE','DEMONSTRATED CAPABILITIES','PROGRAMMING LANGUAGES'];
const categories=['LANGUAGE','TOOL / FRAMEWORK'];
const GRAPH_HEIGHT=820;

export function mountExperienceNetwork(){
  const shell=document.getElementById('experience-graphic');if(!shell)return null;
  const panel=document.getElementById('network-focus');
  const svg=document.getElementById('network-connections');
  const mobile=document.getElementById('network-mobile');
  const fit=document.getElementById('network-fit');
  const label=document.getElementById('network-third-label');
  const toggleButtons=[...document.querySelectorAll('[data-network-view]')];
  let selected='teckpulse',hovered=null,view='languages',scale=1;
  const getNodes=()=>[...roleNodes,...capabilityNodes,...(view==='languages'?languages:tools)];
  const getEdges=()=>[...roleEdges.map(([a,b])=>({a,b,kind:'resume'})),...technologyEdges[view].map(([a,b])=>({a,b,kind:'thematic'}))];
  const map=()=>new Map(getNodes().map(n=>[n.id,n]));
  const graph=()=>{const n=new Map(getNodes().map(x=>[x.id,new Set()]));for(const {a,b} of getEdges()){n.get(a)?.add(b);n.get(b)?.add(a)}return n;};

  function renderStructure(){
    const items=getNodes(),nodeById=map();
    shell.innerHTML=items.map((n,i)=>`<button type="button" class="network-node network-node-${n.layer}" data-network="${n.id}" style="left:${n.layer===0?142:n.layer===1?505:864}px;top:${n.y}px;--node-idx:${i}" aria-pressed="false" aria-label="Explore ${escapeHtml(n.name)}"><span class="network-node-orb" aria-hidden="true"></span><span class="network-node-label">${escapeHtml(n.short)}</span><span class="network-node-foot">${escapeHtml(n.layer===0?n.meta.split(' · ')[1]:n.layer===1?'CAPABILITY':view==='languages'?'LANGUAGE':'TOOL')}</span></button>`).join('');
    const defs=`<defs><linearGradient id="synapse" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#287aa6"/><stop offset=".5" stop-color="#b5e9ff"/><stop offset="1" stop-color="#3c90c5"/></linearGradient></defs>`;
    svg.innerHTML=defs+getEdges().map(({a,b,kind})=>{
      const n=nodeById.get(a),m=nodeById.get(b);const x1=(n.layer===0?142:505)+(n.layer===0?105:105);const x2=(m.layer===1?505:864)-(m.layer===1?105:94);const bend=(x2-x1)*.43;
      const d=`M ${x1} ${n.y} C ${x1+bend} ${n.y},${x2-bend} ${m.y},${x2} ${m.y}`;
      return `<path class="network-edge network-edge-${kind}" data-from="${a}" data-to="${b}" d="${d}"/><path class="network-edge-flow" data-from="${a}" data-to="${b}" d="${d}"/>`;
    }).join('');
    const layerList=[roleNodes,capabilityNodes,view==='languages'?languages:tools];
    const titles=['01 / PROFESSIONAL EXPERIENCE','02 / CAPABILITIES',view==='languages'?'03 / PROGRAMMING LANGUAGES':'03 / TOOLS & FRAMEWORKS'];
    mobile.innerHTML=layerList.map((set,i)=>`<div class="network-mobile-layer"><p>${titles[i]}</p><div>${set.map(n=>`<button data-network="${n.id}" type="button" aria-pressed="false">${escapeHtml(n.short)}</button>`).join('')}</div></div>`).join('');
    if(label)label.textContent=titles[2];
    toggleButtons.forEach(b=>{const active=b.dataset.networkView===view;b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-active',active)});
    // Event delegation remains stable when the rightmost layer is switched.
    draw();
  }
  function getRelated(id){
    if(!id)return new Set(getNodes().map(n=>n.id));
    const neighborhood=graph(),related=new Set([id]);
    const n=map().get(id);
    const direct=[...(neighborhood.get(id)||[])];
    for(const next of direct)related.add(next);
    // Follow the direction of the diagram. A selected role illuminates its
    // capabilities and their technologies, not unrelated employers that
    // happen to share the same capability.
    if(n?.layer===0){
      for(const c of direct)for(const t of neighborhood.get(c)||[])if(map().get(t)?.layer===2)related.add(t);
    }else if(n?.layer===2){
      for(const c of direct)for(const r of neighborhood.get(c)||[])if(map().get(r)?.layer===0)related.add(r);
    }
    return related;
  }
  function draw(){
    const related=getRelated(hovered||selected);
    shell.querySelectorAll('[data-network]').forEach(el=>{const id=el.dataset.network;el.classList.toggle('is-selected',id===selected);el.classList.toggle('is-related',related.has(id));el.classList.toggle('is-muted',!related.has(id));el.setAttribute('aria-pressed',String(id===selected))});
    svg.querySelectorAll('[data-from]').forEach(el=>{const highlighted=related.has(el.dataset.from)&&related.has(el.dataset.to);el.classList.toggle('is-related',highlighted);el.classList.toggle('is-muted',!highlighted)});
    mobile.querySelectorAll('button').forEach(el=>{const active=el.dataset.network===selected;el.classList.toggle('is-selected',active);el.setAttribute('aria-pressed',String(active))});
  }
  function focus(id){
    if(!map().has(id))return;selected=id;hovered=null;
    const n=map().get(id);const adjacent=[...(graph().get(id)||[])].map(x=>map().get(x));
    const readableContext=n.layer===0?'Source: supplied résumé.':n.layer===1?'Skills evidenced by the selected professional roles or related portfolio work.':n.meta.includes('RESUME')?'Listed on the résumé; no role-specific use is assumed.':'Technology evidence is explained in the description.';
    const bullets=n.points?.length?`<div class="network-focus-proof"><strong>WHAT THE WORK SHOWS</strong><ul>${n.points.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div>`:'';
    const chips=n.keywords?.length?`<div class="network-focus-keywords"><strong>${n.layer===0?'SKILLS & TECHNOLOGIES':'RELATED KEYWORDS'}</strong><div>${n.keywords.map(k=>`<span>${escapeHtml(k)}</span>`).join('')}</div></div>`:'';
    panel.innerHTML=`<div class="network-focus-top"><span>NODE / 0${n.layer+1}</span><span>SELECTED SIGNAL</span></div><p class="network-focus-category">${escapeHtml(n.layer===2?(view==='languages'?layerLabels[2]:'TOOLS & FRAMEWORKS'):layerLabels[n.layer])}</p><h3>${escapeHtml(n.name)}</h3><p class="network-focus-meta">${escapeHtml(n.meta)}</p><p class="network-focus-copy">${escapeHtml(n.description)}</p>${n.metric?`<div class="network-focus-result"><strong>${escapeHtml(n.metric)}</strong><span>${escapeHtml(n.metricLabel)}</span><small>${escapeHtml(n.context)}</small></div>`:''}${bullets}${chips}<div class="network-focus-links"><strong>FOLLOW A CONNECTION (${adjacent.length})</strong><div>${adjacent.length?adjacent.map(c=>`<button type="button" data-network="${c.id}">${escapeHtml(c.short)}</button>`).join(''):'<span>No professional connection is claimed for this technology</span>'}</div></div>${n.project?`<button class="network-project-jump" type="button" data-network-project="${n.project}">Explore ${escapeHtml(n.project==='quantumoptlab'?'QuantumOptLab':'TransitPulse')} in the project stack</button>`:''}<p class="network-disclaimer">${escapeHtml(readableContext)} The graph is a curated skill map, not learned neural weights or a proficiency score. Links between capabilities and technologies are thematic—not an employer software inventory.</p><button class="network-show-all" type="button" data-network-all>Show all connections</button>`;
    draw();
  }
  function changeView(next){
    if(next!=='languages'&&next!=='tools')return;
    view=next;
    // Keep the selected professional role/capability; reset technology selections
    // that are absent in the newly visible layer.
    if(selected!==null&&![...roleNodes,...capabilityNodes,...(view==='languages'?languages:tools)].some(n=>n.id===selected))selected='teckpulse';
    if(selected===null)showAll();else{renderStructure();focus(selected);}
  }
  function showAll(){selected=null;hovered=null;renderStructure();panel.innerHTML=`<div class="network-focus-top"><span>NETWORK OVERVIEW</span><span>ALL SIGNALS</span></div><p class="network-focus-category">EXPLORE EXPERIENCE</p><h3>Skills behind the work.</h3><p class="network-focus-copy">Four professional roles connect to ten practical capabilities. Switch between the programming languages and tools on the right, then select any node to trace its relevant relationships.</p><div class="network-overview-stats"><span><strong>04</strong> Roles</span><span><strong>10</strong> Capabilities</span><span><strong>${view==='languages'?'08':'11'}</strong> ${view==='languages'?'Languages':'Tools'}</span></div><p class="network-disclaimer">A connection is a résumé-supported role-to-capability relationship or a thematic skill-to-technology mapping. The visualization makes no claim about learned neural weights, proficiency scores, or exact employer technology stacks.</p><button type="button" class="network-show-all" data-network="teckpulse">Start with TeckPulse</button>`;draw();}
  shell.addEventListener('click',e=>{const b=e.target.closest('[data-network]');if(b)focus(b.dataset.network)});
  mobile.addEventListener('click',e=>{const b=e.target.closest('[data-network]');if(b){focus(b.dataset.network);panel.scrollIntoView?.({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}});
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-network]');if(b)focus(b.dataset.network);if(e.target.closest('[data-network-all]'))showAll();const p=e.target.closest('[data-network-project]');if(p){const project=p.dataset.networkProject;const ids=['exchangecore','scanner','evidencesearch','transitpulse','quantumoptlab','simshiftq','financialscenarios'];const i=ids.indexOf(project);if(i>=0){document.querySelector(`#project-index [data-idx="${i}"]`)?.click();document.getElementById('engine')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}}});
  toggleButtons.forEach(b=>b.addEventListener('click',()=>changeView(b.dataset.networkView)));
  shell.addEventListener('pointerover',e=>{const b=e.target.closest('[data-network]');if(b&&b.dataset.network!==hovered){hovered=b.dataset.network;draw()}});
  shell.addEventListener('pointerout',e=>{const b=e.target.closest('[data-network]');if(b&&!b.contains(e.relatedTarget)){hovered=null;draw()}});
  shell.addEventListener('focusin',e=>{const b=e.target.closest('[data-network]');if(b){hovered=b.dataset.network;draw()}});
  shell.addEventListener('focusout',e=>{const b=e.target.closest('[data-network]');if(b){hovered=null;draw()}});
  function resize(){scale=Math.min(1,fit.getBoundingClientRect().width/1000);fit.style.height=`${GRAPH_HEIGHT*scale}px`;fit.style.setProperty('--network-scale',String(scale));}
  const motion=window.matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)');
  if(motion.matches){fit.addEventListener('pointermove',e=>{const r=fit.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;fit.style.setProperty('--graph-yaw',`${(x*2.1).toFixed(2)}deg`);fit.style.setProperty('--graph-pitch',`${(-y*1.3).toFixed(2)}deg`)});fit.addEventListener('pointerleave',()=>{fit.style.setProperty('--graph-yaw','0deg');fit.style.setProperty('--graph-pitch','0deg')})}
  const observer=new ResizeObserver(resize);observer.observe(fit);
  renderStructure();resize();focus(selected);
  return{focus,changeView,showAll,destroy(){observer.disconnect()}};
}
