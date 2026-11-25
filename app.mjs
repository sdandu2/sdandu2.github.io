import { projects } from './data.mjs';
import { insights, financeNotes } from './insights.mjs';
import { mountJourney } from './journey.mjs';
import { mountSkillAtlas as mountProjectNetwork } from './skill-atlas.mjs';

const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dialog = document.getElementById('deep-dive');
const content = document.getElementById('deep-content');

function closeNotes() {
  if (dialog.open) dialog.close();
}

dialog.querySelector('.dialog-close').addEventListener('click', closeNotes);
dialog.addEventListener('click', evt => { if (evt.target === dialog) closeNotes(); });

function showNotes(id) {
  const p = projects.find(x => x.id === id);
  const n = p?.id === 'financialscenarios' ? financeNotes : insights[p?.id];
  if (!p || !n) return;
  content.innerHTML = `<p class="deep-overline">A CLOSER LOOK</p><h2 id="deep-title">${e(p.name)}</h2><div class="deep-grid"><div><span>QUESTION</span><p>${e(n.question)}</p></div><div><span>WHAT I BUILT</span><p>${e(n.built)}</p></div><div><span>WHY I MADE THAT DECISION</span><p>${e(n.choice)}</p></div><div><span>WHAT THE EVIDENCE SUPPORTS</span><p>${e(n.evidence)}</p></div></div>${n.proof ? `<img class="deep-proof" src="${e(n.proof)}" alt="Project evidence image for ${e(p.name)}" loading="lazy">` : ''}<p class="deep-limit"><strong>LIMITATIONS.</strong> ${e(n.limitation)}</p>${p.repo ? `<a class="deep-repo" href="${e(p.repo)}" target="_blank" rel="noopener noreferrer">Inspect project repository</a>` : ''}`;
  dialog.showModal();
}

const projectNetwork = mountProjectNetwork({ onShowNotes: showNotes });
mountJourney();

const disciplines = {
  Software: {
    text: 'I enjoy figuring out how different parts of a system come together to solve a problem. These projects let me explore everything from building applications to understanding the software behind them.',
    ids: ['exchangecore', 'transitpulse', 'evidencesearch', 'scanner', 'quantumoptlab'] // ids:['exchangecore','transitpulse','evidencesearch','scanner','quantumoptlab']
  },
  'Applied ML': {
    text: "I like exploring how machine learning can help solve real problems. I'm especially interested in how different models work, where they struggle, and what I can learn by testing them.",
    ids: ['scanner', 'evidencesearch', 'simshift-q', 'financialscenarios']
  },
  Quantum: {
    text: "I'm still learning about quantum computing. I've been using simulations to understand what quantum algorithms can do, where they struggle, and how different design choices affect the results.",
    ids: ['quantumoptlab', 'simshift-q']
  },
  'Quantitative finance': {
    text: 'I want to understand how financial markets work and how programming and mathematics can help me explore them. My projects look at trading rules and simulated market outcomes under different assumptions.',
    ids: ['exchangecore', 'financialscenarios']
  }
};

const panel = document.getElementById('discipline-details');
const disciplineButtons = [...document.querySelectorAll('[data-discipline]')];
let openDiscipline = null;

function gotoProject(id) {
  projectNetwork?.focus(id, {scrollToDetail:false});
  document.getElementById('engine')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

disciplineButtons.forEach(b => b.addEventListener('click', () => {
  const key = b.dataset.discipline;
  openDiscipline = openDiscipline === key ? null : key;
  disciplineButtons.forEach(other => {
    const pressed = other.dataset.discipline === openDiscipline;
    other.setAttribute('aria-expanded', String(pressed));
    other.classList.toggle('discipline-active', pressed);
  });
  if (!openDiscipline) {
    panel.hidden = true;
    panel.innerHTML = '';
    return;
  }
  const cfg = disciplines[key];
  panel.hidden = false;
  panel.innerHTML = `<div class="discipline-intro"><p class="overline">${e(key)} / SELECT A PROJECT</p><p>${e(cfg.text)}</p></div><div class="discipline-projects">${cfg.ids.map(id => {
    const p = projects.find(x => x.id === id);
    return `<button type="button" data-jump="${e(id)}">${e(p.name)}</button>`;
  }).join('')}</div>`;
}));

panel.addEventListener('click', evt => {
  const b = evt.target.closest('[data-jump]');
  if (b) gotoProject(b.dataset.jump);
});

window.portfolioShowProject = gotoProject;
