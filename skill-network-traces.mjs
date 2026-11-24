/** M6.45 — project-scoped eight-layer evidence graph.
 * Every displayed skill names at least one supported portfolio project.
 * Edges indicate co-occurring, project-supported skills in consecutive
 * disciplines — not a direct software dependency or proficiency score.
 * All seven project routes span eight layers; every non-terminal skill also has
 * a rightward, project-supported connection to the final engineering layer.
 */
import {skillNodes as catalog} from './skill-network-data.mjs';
const library=new Map(catalog.map(n=>[n.id,n]));
const selection={
 projects:['scanner','evidencesearch','transitpulse','quantumoptlab','simshift-q','exchangecore','financialscenarios'],
 domains:['vision','retrieval','data-engineering','ml-eval','quantum-sim','quantum-net','systems','quant-finance'],
 'ml-methods':['anomaly','feature-engineering','semantic-search','ingestion','simulation','forecasting','shift-eval','benchmark'],
 'systems-methods':['data-pipelines','api-engineering','qaoa','quantum-noise','deterministic-testing','order-matching','controlled-experiments','scenario-gen'],
 math:['auroc','ndcg','statistics','linear-algebra','time-series','probability','maxcut','optimization-math','scenario-dist','time-counts'],
 languages:['python','typescript','sql','cpp'],
 platforms:['pytorch','fastapi','react','postgres','docker','qiskit','git','cmake','notebooks'],
 practices:['evaluation-rigor','experiment-design','reproducibility','debugging','testing','tradeoffs','communication']
};
export const visualColumns=[
 {id:'projects',label:'Projects',note:'Seven portfolio builds'},
 {id:'domains',label:'Domains',note:'Problems addressed'},
 {id:'ml-methods',label:'ML & data methods',note:'Modeling and analysis'},
 {id:'systems-methods',label:'Algorithms & systems',note:'Implementation techniques'},
 {id:'math',label:'Math & statistics',note:'Evaluation and foundations'},
 {id:'languages',label:'Languages',note:'Languages used'},
 {id:'platforms',label:'Frameworks & tools',note:'Tools and environments'},
 {id:'practices',label:'Engineering habits',note:'Quality and communication'}
];
export const skillNodes=visualColumns.flatMap(column=>selection[column.id].map(short=>{
 const id=column.id==='projects'?short:`skill-${short}`;
 const original=library.get(id);
 if(!original)throw Error(`Missing portfolio topic ${id}`);
 if(!original.projects.length)throw Error(`Unsupported visible topic ${id}`);
 return {...original,visualColumn:column.id};
}));
export const skillsById=new Map(skillNodes.map(n=>[n.id,n]));
export const projectIds=selection.projects;
const groups=visualColumns.map(c=>skillNodes.filter(n=>n.visualColumn===c.id));
const byProject=projectIds.map(p=>groups.map(group=>group.filter(n=>n.projects.includes(p))));
for(let pi=0;pi<projectIds.length;pi++){
 const missing=visualColumns.filter((c,i)=>!byProject[pi][i].length);
 if(missing.length)throw Error(`${projectIds[pi]} lacks coverage in ${missing.map(c=>c.label).join(', ')}`);
}
// Anchors are chosen to tell a factually grounded project story, and
// every project is guaranteed a continuous seven-segment route.
const anchorNames={
 scanner:['scanner','skill-vision','skill-anomaly','skill-deterministic-testing','skill-auroc','skill-python','skill-pytorch','skill-evaluation-rigor'],
 evidencesearch:['evidencesearch','skill-retrieval','skill-semantic-search','skill-api-engineering','skill-ndcg','skill-python','skill-fastapi','skill-communication'],
 transitpulse:['transitpulse','skill-data-engineering','skill-ingestion','skill-data-pipelines','skill-time-counts','skill-typescript','skill-docker','skill-debugging'],
 quantumoptlab:['quantumoptlab','skill-quantum-sim','skill-benchmark','skill-qaoa','skill-probability','skill-python','skill-qiskit','skill-experiment-design'],
 'simshift-q':['simshift-q','skill-quantum-net','skill-forecasting','skill-controlled-experiments','skill-time-series','skill-python','skill-pytorch','skill-experiment-design'],
 exchangecore:['exchangecore','skill-systems','skill-benchmark','skill-order-matching','skill-optimization-math','skill-cpp','skill-cmake','skill-tradeoffs'],
 financialscenarios:['financialscenarios','skill-quant-finance','skill-simulation','skill-scenario-gen','skill-scenario-dist','skill-python','skill-notebooks','skill-tradeoffs']
};
export const anchors=new Map(Object.entries(anchorNames));
const links=new Map();
function add(a,b,p){
 const na=skillsById.get(a),nb=skillsById.get(b);
 if(!na||!nb)throw Error(`Invalid link ${a} → ${b}`);
 if(!na.projects.includes(p)||!nb.projects.includes(p))throw Error(`Unsupported project association ${p}: ${a} → ${b}`);
 const ai=visualColumns.findIndex(c=>c.id===na.visualColumn);
 const bi=visualColumns.findIndex(c=>c.id===nb.visualColumn);
 if(bi-ai!==1)throw Error(`Nonadjacent connection ${a} → ${b}`);
 const key=`${a}|${b}`;
 if(!links.has(key))links.set(key,{from:a,to:b,projects:[]});
 const l=links.get(key);if(!l.projects.includes(p))l.projects.push(p);
}
for(const p of projectIds){
 const row=anchorNames[p];
 if(row.length!==8)throw Error(`Incomplete project route: ${p}`);
 for(let k=1;k<8;k++)add(row[k-1],row[k],p);
}
// Attach every remaining supported topic to a project route. Each new edge
// connects a skill to a topic already reachable from the SAME project.
const connected=new Map(projectIds.map(p=>[p,new Set(anchorNames[p])]));
const pending=skillNodes.filter(n=>![...connected.values()].some(s=>s.has(n.id)));
let guard=0;
while(pending.length){
 if(++guard>skillNodes.length)throw Error('Unable to cover every visible skill');
 let didSomething=false;
 for(let j=pending.length-1;j>=0;j--){
  const n=pending[j];const ni=visualColumns.findIndex(c=>c.id===n.visualColumn);
  const possible=[];
  for(const project of n.projects){
   const seen=connected.get(project);
   if(!seen)continue;
   for(const adjIndex of [ni-1,ni+1]){
    if(adjIndex<0||adjIndex>=8)continue;
    const adj=byProject[projectIds.indexOf(project)][adjIndex].filter(other=>seen.has(other.id));
    for(const other of adj){
     const from=adjIndex<ni?other.id:n.id;
     const to=adjIndex<ni?n.id:other.id;
     // Prefer a short, shared edge that is already in the diagram.
     const reuse=links.has(`${from}|${to}`)?1:0;
     const rank=(reuse*100) + (adjIndex<ni?8:0) + (8-adj.length);
     possible.push({project,from,to,rank});
    }
   }
  }
  possible.sort((a,b)=>b.rank-a.rank);
  if(!possible.length)continue;
  const x=possible[0];add(x.from,x.to,x.project);
  connected.get(x.project).add(n.id);
  pending.splice(j,1);didSomething=true;
 }
 if(!didSomething)throw Error(`Unreachable project topics: ${pending.map(n=>n.title).join(', ')}`);
}
// A few additional cross-category associations show that commonly used
// skills (for example Python and evaluation) belong to more than one project.
// Prefer an existing connected neighbor in the same project so these are
// genuine, complete project traces rather than decorative disconnected edges.
while(links.size<70){
 const options=[];
 for(const project of projectIds){
  const seen=connected.get(project);
  for(const n of skillNodes){
   if(!n.projects.includes(project)||seen.has(n.id))continue;
   const i=visualColumns.findIndex(c=>c.id===n.visualColumn);
   for(const neighborIndex of [i-1,i+1]){
    if(neighborIndex<0||neighborIndex>7)continue;
    for(const near of byProject[projectIds.indexOf(project)][neighborIndex]){
     if(!seen.has(near.id))continue;
     const a=neighborIndex<i?near.id:n.id;
     const b=neighborIndex<i?n.id:near.id;
     if(!links.has(`${a}|${b}`))options.push({project,n,a,b,priority:seen.size*-.12+(neighborIndex<i?0.4:0)+(n.projects.length>1?1:0)});
    }
   }
  }
 }
 options.sort((a,b)=>b.priority-a.priority||a.a.localeCompare(b.a)||a.b.localeCompare(b.b));
 if(!options.length)throw Error('Insufficient real cross-category associations to reach the graph budget');
 const item=options[0];add(item.a,item.b,item.project);
 connected.get(item.project).add(item.n.id);
}
// M6.47: every skill before the final column needs an evidenced, rightward
// route. These links are all shared by the same portfolio project on both ends.
const rightwardBridges=[
 ['skill-ml-eval','skill-semantic-search','evidencesearch'],
 ['skill-feature-engineering','skill-deterministic-testing','scanner'],
 ['skill-shift-eval','skill-controlled-experiments','simshift-q'],
 ['skill-quantum-noise','skill-maxcut','quantumoptlab'],
 ['skill-statistics','skill-python','scanner'],
 ['skill-linear-algebra','skill-python','scanner'],
 ['skill-probability','skill-python','quantumoptlab'],
 ['skill-sql','skill-postgres','transitpulse'],
 ['skill-react','skill-debugging','evidencesearch'],
 ['skill-git','skill-communication','scanner']
];
for(const [a,b,p] of rightwardBridges)add(a,b,p);
// Close two final-layer routes so no node is a dead end.
add('skill-maxcut','skill-python','quantumoptlab');
add('skill-postgres','skill-debugging','transitpulse');
// Remove ten redundant secondary links after the forward routes have been
// connected. Original project support and eight-category traversals persist.
const replacedLinks=[
 ['skill-benchmark','skill-deterministic-testing'],
 ['scanner','skill-ml-eval'],
 ['skill-notebooks','skill-communication'],
 ['evidencesearch','skill-data-engineering'],
 ['simshift-q','skill-ml-eval'],
 ['skill-qaoa','skill-maxcut'],
 ['skill-cmake','skill-testing'],
 ['skill-typescript','skill-postgres'],
 ['exchangecore','skill-quant-finance'],
 ['skill-controlled-experiments','skill-probability'],
 ['quantumoptlab','skill-ml-eval'],
];
for(const [a,b] of replacedLinks){
 if(!links.delete(`${a}|${b}`))throw Error(`Missing redundant link to replace: ${a} → ${b}`);
}
if(links.size!==70)throw Error(`Expected 70 project-scoped connections, found ${links.size}`);
export const skillLinks=[...links.values()];
export const skillGraphStats=Object.freeze({topics:skillNodes.length,connections:skillLinks.length,projects:projectIds.length,documented:skillLinks.length,conceptual:0});
// Testable audit: every skill must be reachable along actual project-scoped
// edges from at least one project. Every project route crosses seven boundaries.
export function traceReachable(project){
 const seen=new Set([project]);let advanced=true;
 while(advanced){advanced=false;for(const e of skillLinks){if(e.projects.includes(project)&&seen.has(e.from)&&!seen.has(e.to)){seen.add(e.to);advanced=true;}}}
 return seen;
}
for(const p of projectIds){
 const seen=traceReachable(p);
 for(const id of anchorNames[p])if(!seen.has(id))throw Error(`Broken route ${p} → ${id}`);
}
for(const n of skillNodes){
 if(!n.projects.some(p=>traceReachable(p).has(n.id)))throw Error(`Skill not traceable to any project: ${n.id}`);
}

// Every nonterminal topic, not only each project, must lead to the final layer
// using connections supported by a single portfolio project.
for(const n of skillNodes){
 const col=visualColumns.findIndex(c=>c.id===n.visualColumn);
 if(col===7)continue;
 const valid=n.projects.some(project=>{
  const origin=traceReachable(project);
  if(!origin.has(n.id))return false;
  const walked=new Set([n.id]);let pending=true;
  while(pending){pending=false;for(const e of skillLinks){
   if(e.projects.includes(project)&&walked.has(e.from)&&!walked.has(e.to)){
    walked.add(e.to);pending=true;
   }
  }}
  return [...walked].some(id=>skillsById.get(id).visualColumn==='practices');
 });
 if(!valid)throw Error(`No project-supported downstream route: ${n.id}`);
}
