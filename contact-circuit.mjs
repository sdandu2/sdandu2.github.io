// M6.53: optional visual focus. Native links always remain usable.
const circuit=document.querySelector('.qc-circuit');
if(circuit){
  const gates=[...circuit.querySelectorAll('.qc-gate[data-channel]')];
  const branches=[...circuit.querySelectorAll('.qc-branch[data-branch]')];
  const clear=()=>{circuit.classList.remove('has-active');branches.forEach(b=>b.classList.remove('is-active'));gates.forEach(g=>g.classList.remove('is-active'));};
  const activate=(channel)=>{circuit.classList.add('has-active');branches.forEach(b=>b.classList.toggle('is-active',b.dataset.branch===channel));gates.forEach(g=>g.classList.toggle('is-active',g.dataset.channel===channel));};
  for(const gate of gates){
    gate.addEventListener('pointerenter',()=>activate(gate.dataset.channel));
    gate.addEventListener('pointerleave',()=>{if(document.activeElement!==gate)clear();});
    gate.addEventListener('focus',()=>activate(gate.dataset.channel));
    gate.addEventListener('blur',()=>clear());
  }
  const copyButton=circuit.querySelector('[data-copy-email]');
  circuit.addEventListener('pointerleave',()=>{if(!gates.includes(document.activeElement) && document.activeElement!==copyButton)clear();});
  if(copyButton){
    const label=copyButton.querySelector('.qc-email-copy-label');
    const status=circuit.querySelector('.qc-email-copy-status');
    const originalLabel=label.textContent;
    const email=copyButton.dataset.copyEmail;
    const fallbackCopy=(value)=>{
      const field=document.createElement('textarea');
      field.value=value;
      field.setAttribute('readonly','');
      field.style.position='fixed';
      field.style.left='-9999px';
      document.body.append(field);
      field.select();
      let copied=false;
      try{copied=document.execCommand('copy');}catch(_error){copied=false;}
      field.remove();
      return copied;
    };
    copyButton.addEventListener('pointerenter',()=>activate('email'));
    copyButton.addEventListener('pointerleave',()=>{if(document.activeElement!==copyButton)clear();});
    copyButton.addEventListener('focus',()=>activate('email'));
    copyButton.addEventListener('blur',()=>clear());
    copyButton.addEventListener('click',async()=>{
      let copied=false;
      try{
        if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(email);copied=true;}
      }catch(_error){copied=false;}
      if(!copied)copied=fallbackCopy(email);
      if(copied){
        label.textContent='Copied!';
        copyButton.classList.add('is-copied');
        status.textContent='Email address copied to clipboard.';
      }else{
        label.textContent='Copy unavailable';
        status.textContent=`Unable to copy automatically. Email address: ${email}`;
      }
    });
    // Restore the default label as soon as the user leaves the button;
    // the live region keeps the result accessible to screen readers.
    copyButton.addEventListener('blur',()=>{
      if(label.textContent!==originalLabel){label.textContent=originalLabel;copyButton.classList.remove('is-copied');}
    });
  }
}
