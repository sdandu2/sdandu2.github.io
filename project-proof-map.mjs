/** Milestone 6.43: restored, always-visible three-layer portfolio knowledge graph.
 * All graph data comes from the existing curated projectGraph and supporting evidence map.
 * No inferred employer stacks, simulated weights or generated images.
 */
import { projectGraph, projectTechnologyEvidence, traceProjectGraph } from './project-network.mjs';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const layerNames = ['Projects','Capabilities','Technologies'];
const graphNodes = projectGraph.nodes;
const graphEdges = projectGraph.edges;
const byId = new Map(graphNodes.map(n => [n.id,n]));
const edgeId = (a,b) => `${a}|${b}`;
const tracks = {
  all: { label: 'Full network', ids: [] },
  software: { label: 'Software', ids: ['exchangecore','transitpulse','evidencesearch'] },
  ml: { label: 'ML & Data', ids: ['scanner','evidencesearch','transitpulse'] },
  quantum: { label: 'Quantum', ids: ['quantumoptlab','simshift-q'] },
  quant: { label: 'Quant Finance', ids: ['exchangecore','financialscenarios'] },
};

function selectedTrace(nodeId, career) {
  if (nodeId) return traceProjectGraph(nodeId);
  if (career === 'all') return traceProjectGraph();
  const nodeIds = new Set(), edgeKeys = new Set();
  for (const projectId of tracks[career].ids) {
    const trace = traceProjectGraph(projectId);
    trace.nodeIds.forEach(id => nodeIds.add(id));
    trace.edgeKeys.forEach(id => edgeKeys.add(id));
  }
  return {nodeIds,edgeKeys};
}

function connectedIds(nodeId) {
  return graphEdges.filter(([a,b]) => a===nodeId || b===nodeId).map(([a,b]) => a===nodeId ? b : a);
}

/** Each project gets real project->capability->technology routes, not isolated horizontal segments. */
export function projectProofRouteStats(id) {
  const trace = traceProjectGraph(id);
  const projectToCapability = [...trace.edgeKeys].filter(k => k.startsWith(`${id}|`));
  const capabilityToTechnology = [...trace.edgeKeys].filter(k => !k.startsWith(`${id}|`));
  return {projectToCapability:projectToCapability.length,capabilityToTechnology:capabilityToTechnology.length,total:trace.edgeKeys.size};
}

export function mountProjectProofMap() {
  const container=document.getElementById('proof-map');
  if(!container) return null;
  const graph=document.getElementById('proof-map-graph');
  const holder=document.getElementById('proof-map-nodes');
  const svg=document.getElementById('proof-map-wires');
  const details=document.getElementById('proof-map-detail');
  const mobile=document.getElementById('proof-map-mobile');
  const readout=document.getElementById('proof-map-readout');
  const lensHolder=document.getElementById('proof-map-lenses');
  const pause=document.getElementById('proof-map-motion');
  const reset=document.getElementById('proof-map-reset');
  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let selected=null, hovered=null, career='all', motion=!reduced();
  let observer=null;

  // Measured node centers and endpoint coordinates prevent lines from being
  // offset when the browser width, zoom, fonts or layout changes.
  const nodesByLayer=[0,1,2].map(layer=>graphNodes.filter(n=>n.layer===layer));
  holder.innerHTML=graphNodes.map(n=>{
    const order=nodesByLayer[n.layer].findIndex(item=>item.id===n.id);
    const top=[116,81,70][n.layer]+order*[91,73,64][n.layer];
    return `<button type="button" class="proof-neuron proof-neuron-${n.layer}" data-proof-node="${escapeHTML(n.id)}" aria-pressed="false" aria-label="Explore ${escapeHTML(n.name)}" aria-controls="proof-map-detail" style="--node-top:${top}px"><span class="proof-neuron-light" aria-hidden="true"></span><span class="proof-neuron-text"><strong>${escapeHTML(n.short)}</strong><small>${escapeHTML(n.category)}</small></span></button>`;
  }).join('');
  const buttons=new Map([...holder.querySelectorAll('[data-proof-node]')].map(el=>[el.dataset.proofNode,el]));
  lensHolder.innerHTML=Object.entries(tracks).map(([id,info])=>`<button class="proof-lens" type="button" data-proof-lens="${id}" aria-pressed="${id==='all'}">${escapeHTML(info.label)}</button>`).join('');
  mobile.innerHTML=nodesByLayer.map((nodes,layer)=>`<details ${layer===0?'open':''}><summary>${layer+1}. ${layerNames[layer]} (${nodes.length})</summary><div>${nodes.map(n=>`<button type="button" data-proof-node="${escapeHTML(n.id)}">${escapeHTML(n.short)}</button>`).join('')}</div></details>`).join('');

  function redrawPaths() {
    const bound=graph.getBoundingClientRect();
    if(bound.width<50)return;
    const width=graph.clientWidth,height=graph.clientHeight;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    svg.setAttribute('width',String(width));
    svg.setAttribute('height',String(height));
    const rects=new Map([...buttons].map(([id,el])=>[id,el.getBoundingClientRect()]));
    const curves=graphEdges.map(([a,b],i)=>{
      const r=rects.get(a),s=rects.get(b);
      const x1=r.right-bound.left-1,x2=s.left-bound.left+1;
      const y1=r.top+r.height/2-bound.top,y2=s.top+s.height/2-bound.top;
      const bend=Math.max(48,(x2-x1)*.45);
      const d=`M ${x1.toFixed(2)} ${y1.toFixed(2)} C ${(x1+bend).toFixed(2)} ${y1.toFixed(2)}, ${(x2-bend).toFixed(2)} ${y2.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}`;
      return `<g class="proof-wire ${i%7===0?'is-ambient':''}" data-proof-edge="${escapeHTML(edgeId(a,b))}"><path class="proof-wire-outline" d="${d}"/><path class="proof-wire-line" d="${d}"/><path class="proof-wire-pulse" d="${d}" style="--wire-delay:-${(i%13)*.41}s;--wire-speed:${(5.2+(i%6)*.36).toFixed(2)}s"/></g>`;
    }).join('');
    svg.innerHTML=curves;
    updateClasses();
  }

  function updateClasses() {
    const picked=hovered||selected;
    const trace=selectedTrace(picked,career);
    const filtering=Boolean(picked || career!=='all');
    for(const [id,el] of buttons){
      el.classList.toggle('is-active',id===selected);
      el.classList.toggle('is-hovered',id===hovered);
      el.classList.toggle('is-traced',filtering && trace.nodeIds.has(id));
      el.classList.toggle('is-quiet',filtering && !trace.nodeIds.has(id));
      el.setAttribute('aria-pressed',String(id===selected));
    }
    svg.querySelectorAll('[data-proof-edge]').forEach(el=>{
      const traced=filtering && trace.edgeKeys.has(el.dataset.proofEdge);
      el.classList.toggle('is-traced',traced);
      el.classList.toggle('is-quiet',filtering && !traced);
    });
    lensHolder.querySelectorAll('[data-proof-lens]').forEach(el=>{
      el.setAttribute('aria-pressed',String(el.dataset.proofLens===career));
    });
    graph.classList.toggle('is-filtered',filtering);
    graph.classList.toggle('is-paused',!motion);
    pause.textContent=motion?'Pause signals':'Play signals';
    pause.setAttribute('aria-pressed',String(motion));
    const name=picked?byId.get(picked)?.name:career==='all'?'Full network':tracks[career].label;
    readout.textContent=filtering ? `${name} · ${trace.edgeKeys.size} highlighted of ${graphEdges.length} connections · all ${graphNodes.length} nodes present` : `${graphEdges.length} visible connections · ${graphNodes.length} nodes · 7 projects, 10 capabilities, 12 technologies`;
    reset.disabled=!filtering;
  }

  function detailsFor(id) {
    const node=byId.get(id);
    if(!node)return;
    const trace=traceProjectGraph(id);
    const related=new Set(trace.nodeIds);
    const names=layer=>graphNodes.filter(n=>n.layer===layer && related.has(n.id));
    const techs=names(2);
    const capabilities=names(1);
    const sourced=node.layer===0 ? new Set(projectTechnologyEvidence[id]||[]) : null;
    const evidence=node.layer===0?`<div class="proof-detail-evidence"><span>DOCUMENTED TECHNOLOGIES FOR THIS PROJECT</span><div>${[...sourced].map(t=>`<button type="button" data-proof-node="${escapeHTML(t)}">${escapeHTML(byId.get(t)?.name||t)}</button>`).join('')}</div></div>`:'';
    const pathStatement=node.layer===0 ? 'Bright connections follow this project through its capabilities to the documented technologies used in the work.' : 'Highlighted connections show the projects, capabilities and technologies related to this topic. Some capability-to-technology links are conceptual.';
    details.innerHTML=`<div class="proof-detail-top"><div><p class="proof-map-eyebrow">SELECTED / ${escapeHTML(node.category)}</p><h3 id="proof-detail-title" tabindex="-1">${escapeHTML(node.name)}</h3><p>${escapeHTML(node.description)}</p><p class="proof-detail-hint">${escapeHTML(pathStatement)}</p></div><button type="button" data-proof-back>Back to network ↑</button></div><div class="proof-detail-counts"><span><strong>${trace.edgeKeys.size}</strong>Highlighted connections</span><span><strong>${capabilities.length}</strong>Capabilities</span><span><strong>${techs.length}</strong>Technologies</span></div>${evidence}<div class="proof-detail-groups">${[0,1,2].map(layer=>`<div><strong>${layerNames[layer]}</strong><div>${names(layer).map(n=>`<button type="button" data-proof-node="${escapeHTML(n.id)}">${escapeHTML(n.short)}</button>`).join('')||'<span>—</span>'}</div></div>`).join('')}</div><p class="proof-detail-caveat">This is a curated portfolio knowledge graph, not a trained neural network. Project-to-capability connections are supported by project descriptions; capability-to-technology links provide context and are not independently verified implementation claims unless listed in the project technology evidence.</p>`;
  }

  function showOverview() {
    details.innerHTML=`<div class="proof-detail-top"><div><p class="proof-map-eyebrow">NETWORK OVERVIEW / 53 RELATIONSHIPS</p><h3>Follow the work end to end.</h3><p>Seven projects feed into ten engineering capabilities and twelve documented technologies. Every connection is drawn in the overview. Select a project above to illuminate complete routes through the two connecting layers.</p></div><button type="button" data-proof-node="scanner">Trace Scanner →</button></div><div class="proof-detail-counts"><span><strong>07</strong>Portfolio projects</span><span><strong>10</strong>Capabilities</span><span><strong>12</strong>Technologies</span></div><p class="proof-detail-caveat">Connections represent project evidence and contextual technical relationships—not neural-network weights or proficiency scores.</p>`;
  }

  function focus(id,{scrollToDetail=true}={}) {
    if(!byId.has(id))return;
    selected=id;hovered=null;
    updateClasses();detailsFor(id);
    if(scrollToDetail){
      details.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
      // Scrolling preserves normal pointer and keyboard interactions in the graph.
    }
  }
  function setLens(next){
    if(!(next in tracks))return;
    career=next;selected=null;hovered=null;
    showOverview();updateClasses();
  }
  function resetView(){career='all';selected=null;hovered=null;showOverview();updateClasses();}
  function clicked(event){
    const n=event.target.closest('[data-proof-node]');
    if(n){focus(n.dataset.proofNode);return;}
    const lens=event.target.closest('[data-proof-lens]');
    if(lens){setLens(lens.dataset.proofLens);return;}
    if(event.target.closest('[data-proof-back]'))graph.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
  }
  container.addEventListener('click',clicked);
  holder.addEventListener('pointerover',ev=>{
    const n=ev.target.closest('[data-proof-node]');
    if(n && n.dataset.proofNode!==hovered){hovered=n.dataset.proofNode;updateClasses();}
  });
  holder.addEventListener('pointerout',ev=>{
    const n=ev.target.closest('[data-proof-node]');
    if(n && !n.contains(ev.relatedTarget)){hovered=null;updateClasses();}
  });
  holder.addEventListener('focusin',ev=>{const n=ev.target.closest('[data-proof-node]');if(n){hovered=n.dataset.proofNode;updateClasses();}});
  holder.addEventListener('focusout',ev=>{const n=ev.target.closest('[data-proof-node]');if(n&&!n.contains(ev.relatedTarget)){hovered=null;updateClasses();}});
  pause.addEventListener('click',()=>{motion=!motion;updateClasses()});
  reset.addEventListener('click',resetView);
  // A ResizeObserver re-computes actual SVG anchor points at every breakpoint.
  if('ResizeObserver' in window){observer=new ResizeObserver(()=>redrawPaths());observer.observe(graph);}
  window.addEventListener('resize',redrawPaths,{passive:true});
  showOverview();
  requestAnimationFrame(redrawPaths);
  document.fonts?.ready.then(redrawPaths).catch(()=>{});
  return {focus,setLens,reset:resetView,destroy(){observer?.disconnect();window.removeEventListener('resize',redrawPaths)}};
}
