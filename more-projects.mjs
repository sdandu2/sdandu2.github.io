import {additionalProjects} from './additional-projects.mjs';

const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=value=>{
  if(typeof value!=='string')return null;
  try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}
};
const safeAsset=value=>typeof value==='string'&&/^assets\/[a-zA-Z0-9_./-]+\.(?:png|webp|jpe?g|svg)$/.test(value)&&!value.includes('..')?value:null;

export function renderAdditionalProjects(items,holder){
  if(!holder)return 0;
  const usable=(Array.isArray(items)?items:[]).filter(p=>p&&typeof p.name==='string'&&p.name.trim()&&typeof p.summary==='string'&&p.summary.trim());
  holder.innerHTML=usable.map(p=>{
    const image=safeAsset(p.image);
    const repo=safeUrl(p.repo);
    return `<article class="more-projects-card">${image?`<img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)} project visual" loading="lazy" decoding="async">`:''}<div class="more-projects-body"><p class="overline">${escapeHtml(p.category||'PROJECT')}</p><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.summary)}</p>${p.result?`<p class="more-projects-result">${escapeHtml(p.result)}</p>`:''}${repo?`<a href="${escapeHtml(repo)}" target="_blank" rel="noopener noreferrer">View repository</a>`:''}</div></article>`;
  }).join('');
  return usable.length;
}

if(typeof document!=='undefined'){
 const section=document.getElementById('more-projects');
 const holder=document.getElementById('more-projects-list');
 if(section&&holder){
   const count=renderAdditionalProjects(additionalProjects,holder);
   section.hidden=count===0;
 }
}
