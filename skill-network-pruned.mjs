/** M6.38 — an editorial shortlist of 58 role-relevant nodes and EXACTLY 70 links.
 * The 147-topic reference catalog and its 126 original evidence links remain
 * untouched in skill-network-data.mjs for audit and future expansion.
 * Context links are explicitly classified as conceptual, NEVER claimed as proof.
 */
import {skillNodes as fullLibrary, skillLinks as fullEvidence} from './skill-network-data.mjs';

// Visual order follows the visitor's reading path: applied ML -> software ->
// quantum -> quantitative finance. These are topics, not proficiency scores.
const selection = {
  projects: ['scanner','evidencesearch','transitpulse','quantumoptlab','simshift-q','exchangecore','financialscenarios'],
  domains: ['vision','retrieval','data-engineering','ml-eval','quantum-sim','quantum-net','systems','quant-finance'],
  methods: ['anomaly','feature-engineering','semantic-search','data-pipelines','api-engineering','model-serving','mlops','qaoa','quantum-noise','forecasting','shift-eval','benchmark','algorithms','order-matching','backtesting','scenario-gen'],
  math: ['auroc','ndcg','statistics','linear-algebra','time-series','probability','maxcut','optimization-math','scenario-dist'],
  languages: ['python','typescript','sql','cpp'],
  platforms: ['pytorch','fastapi','react','postgres','docker','qiskit','git'],
  practices: ['evaluation-rigor','experiment-design','reproducibility','debugging','testing','tradeoffs','communication']
};
const byId=new Map(fullLibrary.map(node=>[node.id,node]));
const normalize=(column,id)=>column==='projects'?id:`skill-${id}`;
const selectedIds=Object.entries(selection).flatMap(([col,ids])=>ids.map(id=>normalize(col,id)));
export const skillNodes=selectedIds.map(id=>{
  const item=byId.get(id);
  if(!item)throw new Error(`Curated node missing from source catalog: ${id}`);
  return item;
});
export const skillsById=new Map(skillNodes.map(node=>[node.id,node]));
const chosen=new Set(skillsById.keys());
const originalProof=fullEvidence.filter(edge=>chosen.has(edge.from)&&chosen.has(edge.to));

// Additional navigational relationships represent what these disciplines
// have in common, NOT additional work demonstrated by a portfolio project.
// All have no projects, so the renderer gives them a faint, distinct style.
const contextualPairs=[
  ['systems','algorithms'],                 // engineering and complexity
  ['quant-finance','backtesting'],          // research workflow, to explore
  ['ml-eval','feature-engineering'],        // statistical ML foundations
  ['ml-eval','model-serving'],              // from models to service design
  ['data-engineering','mlops'],            // data lifecycle and MLOps
  ['model-serving','statistics'],           // measuring served predictions
  ['mlops','time-series'],                  // monitoring time-varying data
  ['benchmark','statistics'],               // uncertainty in comparisons
  ['algorithms','optimization-math'],       // algorithmic efficiency
  ['shift-eval','statistics'],              // evaluation under change
  ['backtesting','probability'],            // statistical decision-making
  ['feature-engineering','statistics'],     // designing useful signals
  ['statistics','python'],                  // analysis implementation
  ['sql','postgres'],                       // query language and database
  ['python','docker'],                      // containerizing applications
  ['typescript','react'],                   // typed frontend implementation
  ['cpp','git'],                            // versioning systems code
  ['docker','testing'],                     // reproducible test environments
  ['git','reproducibility']                 // versioned experiments
];
const asId=(key)=>byId.has(key)?key:`skill-${key}`;
const contextLinks=contextualPairs.map(([a,b])=>({from:asId(a),to:asId(b),projects:[]}));
export const skillLinks=[...originalProof,...contextLinks];
export const skillGraphStats=Object.freeze({topics:skillNodes.length,connections:skillLinks.length,documented:originalProof.length,conceptual:contextLinks.length,projects:selection.projects.length});

// Guardrails: no duplicates, no stray nodes, exact link budget, full coverage.
const allKeys=new Set();
for(const edge of skillLinks){
  if(!chosen.has(edge.from)||!chosen.has(edge.to))throw new Error(`Invalid edge: ${edge.from} -> ${edge.to}`);
  const key=`${edge.from}|${edge.to}`;
  if(allKeys.has(key))throw new Error(`Duplicate edge: ${key}`);
  allKeys.add(key);
}
const degree=new Map(selectedIds.map(id=>[id,0]));
for(const edge of skillLinks){degree.set(edge.from,degree.get(edge.from)+1);degree.set(edge.to,degree.get(edge.to)+1);}
if([...degree.values()].some(d=>d===0))throw new Error('Every visible node needs a meaningful connection.');
if(skillNodes.length!==58||skillLinks.length!==70)throw new Error('Skill graph must have precisely 58 topics and 70 connections.');
