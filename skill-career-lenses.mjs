/** M6.41 · Editorial career lenses; not proficiency scores or new evidence.
 * These subsets reference EXISTING topics only. All 58 nodes and all 70
 * connections are always rendered in the complete knowledge network.
 */
import {skillNodes,skillLinks} from './skill-network-pruned.mjs';

const ids=skillNodes.map(n=>n.id);
const existing=new Set(ids);
const asId=key=>existing.has(key)?key:`skill-${key}`;
const specs=[
  {id:'all',label:'Full network',description:'Every topic and all 70 relationships are in view.',nodes:ids},
  {id:'software',label:'Software',description:'Systems, APIs, languages, delivery and reliable engineering.',nodes:[
    'exchangecore','transitpulse','evidencesearch','scanner',
    'systems','data-engineering','retrieval','ml-eval',
    'data-pipelines','api-engineering','model-serving','algorithms','order-matching','benchmark',
    'statistics','optimization-math','python','typescript','sql','cpp',
    'fastapi','react','postgres','docker','git',
    'evaluation-rigor','experiment-design','reproducibility','debugging','testing','tradeoffs','communication'
  ]},
  {id:'ml',label:'ML & Data',description:'Model development, information retrieval, evaluation and data pipelines.',nodes:[
    'scanner','evidencesearch','simshift-q','transitpulse','financialscenarios',
    'vision','retrieval','data-engineering','ml-eval',
    'anomaly','feature-engineering','semantic-search','data-pipelines','api-engineering',
    'model-serving','mlops','forecasting','shift-eval','benchmark','scenario-gen',
    'auroc','ndcg','statistics','linear-algebra','time-series','probability','scenario-dist',
    'python','sql','pytorch','fastapi','postgres','docker','git',
    'evaluation-rigor','experiment-design','reproducibility','debugging','testing','tradeoffs','communication'
  ]},
  {id:'quantum',label:'Quantum',description:'Quantum circuits, noise, simulation, mathematics and evaluation.',nodes:[
    'quantumoptlab','simshift-q',
    'quantum-sim','quantum-net','ml-eval','qaoa','quantum-noise',
    'forecasting','benchmark','algorithms',
    'linear-algebra','probability','maxcut','optimization-math','time-series',
    'python','qiskit','pytorch','git',
    'evaluation-rigor','experiment-design','reproducibility','testing','tradeoffs','communication'
  ]},
  {id:'finance',label:'Quant Finance',description:'Market systems, probability, modeling, scenarios and research discipline.',nodes:[
    'exchangecore','financialscenarios',
    'systems','quant-finance','ml-eval',
    'feature-engineering','order-matching','algorithms','backtesting',
    'scenario-gen','forecasting','benchmark','shift-eval',
    'statistics','probability','linear-algebra','optimization-math','time-series','scenario-dist',
    'python','cpp','sql','git',
    'evaluation-rigor','experiment-design','reproducibility','debugging','testing','tradeoffs','communication'
  ]}
];
export const careerLenses=Object.freeze(specs.map(spec=>{
  const unique=new Set(spec.nodes.map(asId));
  for(const id of unique)if(!existing.has(id))throw Error(`Unknown node in career lens ${spec.id}: ${id}`);
  const links=skillLinks.filter(link=>unique.has(link.from)&&unique.has(link.to)).length;
  return Object.freeze({...spec, nodeIds:unique, edgeCount:links, topicCount:unique.size});
}));
export const careerLensById=new Map(careerLenses.map(lens=>[lens.id,lens]));
