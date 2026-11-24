/**
 * Milestone 4.2 — a dependency-free 3D scene projected onto Canvas 2D.
 * Geometry is defined in three spatial dimensions and perspective-projected.
 * The DOM project index remains the full accessible alternative.
 */
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);

export function mountHelixCanvas({scene,projects,getActive,onSelect}) {
  const canvas=document.createElement('canvas');
  canvas.className='helix-canvas';
  canvas.setAttribute('aria-hidden','true');
  scene.insertBefore(canvas,scene.firstChild);
  scene.classList.add('helix-enhanced');
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return {setActive(){},resize(){}};
  let width=0,height=0,dpr=1,targetPhase=0,phase=0,targetOrbit=0,orbit=0;
  let active=getActive(),hovered=-1,frame=0,hitShapes=[];
  let pointerStart=null,dragging=false,lastTime=0,settleFrames=0;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const small=()=>window.matchMedia('(max-width: 620px)').matches;
  const phaseFor=(n)=>n*1.075;
  phase=targetPhase=phaseFor(active);

  function project(x,y,z){
    // Cinematic orthonormal camera: turntable yaw and elevated sightline.
    const yaw=orbit*.45, pitch=.23;
    const rx=x*Math.cos(yaw)-z*Math.sin(yaw);
    const rz=x*Math.sin(yaw)+z*Math.cos(yaw);
    const ry=y*Math.cos(pitch)-rz*Math.sin(pitch);
    const depth=y*Math.sin(pitch)+rz*Math.cos(pitch);
    const focal=780;
    const scale=focal/(focal-depth*.82);
    return {x:width*.43+rx*scale,y:height*.5+ry*scale,z:depth,scale};
  }
  function geometry(i){
    const selected=i===active;
    const angle=i*1.075-phase+.05;
    const rad=160;
    const cx=Math.sin(angle)*rad-(selected?42:0);
    const cy=(i-3)*51-(active-3)*14+(selected?35:0);
    const cz=Math.cos(angle)*145+(selected?117:0);
    const yaw=selected?-0.02:Math.sin(angle)*.82;
    const pitch=selected?-.12:-.09;
    const w=selected?290:212,h=selected?100:79;
    const corner=(lx,ly,depth=0)=>{
      const x=lx*Math.cos(yaw)+depth*Math.sin(yaw);
      const z=-lx*Math.sin(yaw)+depth*Math.cos(yaw);
      const y=ly*Math.cos(pitch)-z*Math.sin(pitch);
      const d=ly*Math.sin(pitch)+z*Math.cos(pitch);
      return project(cx+x,cy+y,cz+d);
    };
    const top=[corner(-w/2,-h/2),corner(w/2,-h/2),corner(w/2,h/2),corner(-w/2,h/2)];
    const bottom=[corner(-w/2,-h/2,-7),corner(w/2,-h/2,-7),corner(w/2,h/2,-7),corner(-w/2,h/2,-7)];
    return {i,selected,top,bottom,depth:cz,w,h};
  }
  function polygon(points){ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.closePath()}
  function glowPath(points,color,blur,weight){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore()}
  function drawBackdrop(){
    const g=ctx.createRadialGradient(width*.43,height*.48,25,width*.43,height*.47,Math.max(width*.56,330));
    g.addColorStop(0,'rgba(17,68,111,.26)');g.addColorStop(.52,'rgba(8,35,62,.12)');g.addColorStop(1,'rgba(3,10,20,0)');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
    ctx.save();ctx.lineWidth=.7;
    // Depth reference: concentric orbital sections, NOT a decorative 2D spiral.
    for(const radius of [180,225]){
      const ring=[];
      for(let t=0;t<=90;t++){
        const a=TAU*t/90;
        ring.push(project(Math.cos(a)*radius,Math.sin(a)*radius*.72,-135));
      }
      glowPath(ring,'rgba(74,143,194,.20)',0,.8);
    }
    ctx.restore();
    // A small physical-looking axis with end caps.
    glowPath([project(0,-248,-12),project(0,248,-12)],'rgba(74,170,222,.23)',4,1.5);
    for(let i=0;i<14;i++){
      const x=(Math.sin(i*92.7)*.5+.5)*width*.80+width*.05;
      const y=(Math.sin(i*37.3)*.5+.5)*height*.88+height*.04;
      ctx.beginPath();ctx.arc(x,y,i%3===0?1.15:.55,0,TAU);ctx.fillStyle=i%3===0?'rgba(125,207,252,.30)':'rgba(90,157,215,.22)';ctx.fill();
    }
  }
  function drawStrands(){
    for(let side=0;side<2;side++){
      const points=[];
      for(let t=0;t<=140;t++){
        const k=t/140*6;
        const a=k*1.075-phase+.05+side*Math.PI;
        points.push(project(Math.sin(a)*160,(k-3)*51-(active-3)*14,Math.cos(a)*145));
      }
      glowPath(points,side?'rgba(61,151,214,.48)':'rgba(78,184,249,.67)',side?6:16,side?1.4:2.2);
    }
    // Small illuminated attachment points emphasize the helical geometry.
    for(let i=0;i<7;i++){
      const angle=i*1.075-phase+.05;
      const p=project(Math.sin(angle)*160,(i-3)*51-(active-3)*14,Math.cos(angle)*145);
      ctx.beginPath();ctx.arc(p.x,p.y,2,0,TAU);ctx.fillStyle='#78c9f5';ctx.shadowBlur=8;ctx.shadowColor='#58c7ff';ctx.fill();ctx.shadowBlur=0;
    }
  }
  function drawPlate(item){
    const {top,bottom,selected,i,w,h}=item;
    const hoveredNow=i===hovered;
    const front=selected||hoveredNow;
    ctx.save();
    // Soft physically separated shadow (extruded bottom surface).
    ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=selected?32:20;ctx.shadowOffsetY=13;
    polygon(bottom);ctx.fillStyle='#020c17';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    polygon([top[3],top[2],bottom[2],bottom[3]]);
    const side=ctx.createLinearGradient(top[3].x,top[3].y,bottom[3].x,bottom[3].y+9);
    side.addColorStop(0,selected?'#1b77af':'#174463');side.addColorStop(1,'#041321');ctx.fillStyle=side;ctx.fill();
    polygon(top);
    const fill=ctx.createLinearGradient(top[0].x,top[0].y,top[2].x,top[2].y);
    if(selected){fill.addColorStop(0,'#133f60');fill.addColorStop(.48,'#0a2b47');fill.addColorStop(1,'#061725')}
    else {fill.addColorStop(0,'rgba(15,45,67,.91)');fill.addColorStop(.58,'rgba(8,28,46,.93)');fill.addColorStop(1,'rgba(5,20,34,.94)')}
    ctx.fillStyle=fill;ctx.fill();
    ctx.strokeStyle=selected?'#94e1ff':front?'#5bbbe9':'rgba(100,159,201,.45)';
    ctx.lineWidth=selected?1.8:front?1.35:1;
    ctx.shadowColor=selected?'rgba(86,189,250,.62)':'transparent';ctx.shadowBlur=selected?17:0;ctx.stroke();ctx.shadowBlur=0;
    polygon([top[0],top[1],{x:mix(top[1].x,top[2].x,.10),y:mix(top[1].y,top[2].y,.10)},{x:mix(top[0].x,top[3].x,.10),y:mix(top[0].y,top[3].y,.10)}]);
    ctx.fillStyle=selected?'rgba(130,226,255,.09)':'rgba(115,196,246,.027)';ctx.fill();
    // Affine projection of interface text onto the actual upper plane.
    const p=top[0],pr=top[1],pb=top[3];
    const a=(pr.x-p.x)/w,b=(pr.y-p.y)/w,c=(pb.x-p.x)/h,d=(pb.y-p.y)/h;
    ctx.setTransform(a*dpr,b*dpr,c*dpr,d*dpr,p.x*dpr,p.y*dpr);
    ctx.fillStyle=selected?'#a4dafa':'#659ab9';ctx.font='600 12px ui-monospace, monospace';ctx.fillText(`L${String(i+1).padStart(2,'0')}`,19,22);
    ctx.fillStyle=selected?'#f1fbff':'#adc9dd';
    const name=projects[i].name;
    const fs=name.length>19?(selected?21:17):(selected?25:19);
    ctx.font=`700 ${fs}px system-ui, sans-serif`;
    ctx.fillText(name,19,61,w-34);
    ctx.beginPath();ctx.moveTo(19,72);ctx.lineTo(selected?190:124,72);ctx.strokeStyle=selected?'#78d5ff':'#397b9c';ctx.lineWidth=1.2;ctx.stroke();
    ctx.beginPath();ctx.arc(w-21,19,4,0,TAU);ctx.strokeStyle=selected?'#8bdafa':'#477b9a';ctx.lineWidth=1.4;ctx.stroke();
    ctx.restore();
  }
  function paint(){
    if(small())return;
    ctx.clearRect(0,0,width,height);
    drawBackdrop();drawStrands();
    const items=projects.map((_,i)=>geometry(i));
    items.sort((a,b)=>a.depth-b.depth);
    // Selected layer is a physically extracted foreground object.
    for(const item of items)drawPlate(item);
    hitShapes=items.slice().reverse().map(p=>({id:p.i,points:p.top}));
    const label=`ORBIT ${String(active+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
    ctx.fillStyle='rgba(118,172,204,.65)';ctx.font='10px ui-monospace,monospace';ctx.fillText(label,24,height-34);
  }
  function tick(t){
    frame=0;
    const dt=Math.min(48,Math.max(8,(t-lastTime)||16));lastTime=t;
    const k=reduceMotion.matches?1:1-Math.exp(-dt/165);
    const dp=targetPhase-phase;
    phase+=dp*k;
    orbit+=(targetOrbit-orbit)*k;
    if(Math.abs(targetPhase-phase)<.0008)phase=targetPhase;
    if(Math.abs(targetOrbit-orbit)<.0008)orbit=targetOrbit;
    paint();
    if(Math.abs(targetPhase-phase)>.001||Math.abs(targetOrbit-orbit)>.001){request()}
  }
  function request(){if(small()||frame)return;frame=requestAnimationFrame(tick)}
  function resize(){
    const box=scene.getBoundingClientRect();
    width=Math.max(200,Math.round(box.width));height=Math.max(250,Math.round(box.height));
    dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    // Canvas dimensions are device pixels; draw in CSS pixels throughout.
    request();
  }
  // Preserve dpr on every frame because per-plate lettering changes transforms.
  const rawPaint=paint;
  paint=()=>{ctx.setTransform(dpr,0,0,dpr,0,0);rawPaint()};
  function setActive(i){active=i;targetPhase=phaseFor(i);request()}
  function inPoly(x,y,pts){
    let hit=false;
    for(let i=0,j=pts.length-1;i<pts.length;j=i++){
      const a=pts[i],b=pts[j];
      if((a.y>y)!==(b.y>y) && x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)hit=!hit;
    }
    return hit;
  }
  function hit(x,y){return hitShapes.find(s=>inPoly(x,y,s.points))?.id??-1}
  canvas.addEventListener('pointerdown',e=>{if(small())return;pointerStart={x:e.offsetX,y:e.offsetY,orbit:targetOrbit};dragging=false;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{
    if(pointerStart){
      const dx=e.offsetX-pointerStart.x,dy=e.offsetY-pointerStart.y;
      if(Math.hypot(dx,dy)>7)dragging=true;
      if(dragging){targetOrbit=clamp(pointerStart.orbit+dx/260,-.8,.8);request()}
    }else{
      const next=hit(e.offsetX,e.offsetY);
      canvas.style.cursor=next>=0?'pointer':'grab';
      if(next!==hovered){hovered=next;request()}
    }
  });
  canvas.addEventListener('pointerup',e=>{if(!pointerStart)return;const wasDragging=dragging;pointerStart=null;dragging=false;if(!wasDragging){const n=hit(e.offsetX,e.offsetY);if(n>=0)onSelect(n)}});
  canvas.addEventListener('pointercancel',()=>{pointerStart=null;dragging=false});
  canvas.addEventListener('pointerleave',()=>{hovered=-1;request()});
  const observer=new ResizeObserver(resize);observer.observe(scene);
  resize();
  return {setActive,resize,destroy(){observer.disconnect();cancelAnimationFrame(frame);canvas.remove()}};
}
