/**
 * M6.23 — Reference-matched glass stack with uniform layer pitch and front-edge indices.
 * Real world-space cuboids, with a deliberately art-directed oblique camera.
 * The exact same geometry, opacity and ordering are used in WebGL and in the
 * accessible Canvas2D fallback; this makes visual verification possible on
 * machines which disable WebGL. Chapter prose stays plain HTML.
 */
const N = 7;
// Canvas is 20% taller than the original design stage. Render at the original
// reference scale while allowing the seventh full-depth plate to clear the UI.
const FRAME_EXTENT = 1.20;
const LAYER_PITCH = 1;
const FRONT_INDEX_ANCHOR = [-.76, -.18, 1];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const lerp = (a, b, t) => a + (b-a)*t;
const ease = t => t*t*(3-2*t);

const FACES = [
  {name:'back',poly:[[-1,0,0],[1,0,0],[1,-.39,0],[-1,-.39,0]]},
  {name:'right',poly:[[1,0,0],[1,0,1],[1,-.39,1],[1,-.39,0]]},
  {name:'left',poly:[[-1,0,1],[-1,0,0],[-1,-.39,0],[-1,-.39,1]]},
  {name:'front',poly:[[-1,0,1],[1,0,1],[1,-.39,1],[-1,-.39,1]]},
  {name:'top',poly:[[-1,0,0],[1,0,0],[1,0,1],[-1,0,1]]},
];
// M6.34 — Sapphire / aurora glass. No changes to any 3D coordinates,
// projection, spacing, hit targets, chapter data, or animation sequencing.
// Active: deep cobalt with a restrained cyan-blue edge; inactive: midnight-indigo glass.
// Both renderers consume the same material colors.
const FACE_COLORS={
  active:{back:[.043,.097,.258,.93],right:[.075,.205,.365,.95],left:[.071,.130,.267,.94],front:[.090,.292,.455,.96],top:[.068,.205,.405,.81]},
  inactive:{back:[.025,.057,.144,.88],right:[.046,.087,.190,.89],left:[.035,.060,.152,.87],front:[.069,.127,.253,.87],top:[.039,.086,.192,.68]}
};
const lineColors={active:[.40,.78,.98,.96],inactive:[.23,.44,.68,.51]};

/** Base geometry in reference-relative image proportions.
 * x is plate width; y is vertical depth through the stack; z is tabletop depth.
 * The projection is deliberately oblique (like an architectural axonometric),
 * preserving the strong diagonal and depth requested in the reference.
 */
function projected(x,y,z,w,h,orbit=0,tilt=0){
  return {x:(.4075+.2805*x+(.121+.018*x+orbit*.055)*z-.013*y)*w,
          y:(.228-.040*x+(.140-.009*x+tilt*.040)*z-.099*y)*h};
}
const offsetFor=(i,active,peel)=>{
  const removed=peel&&i<active;
  const depth=peel?i-active:i;
  return removed ? {x:-2.35,y:1.35,z:-.35,alpha:0} :
    {x:depth*.015,y:-depth*LAYER_PITCH,z:0,alpha:1};
};
const vertex=(local,node)=>[local[0]+node.x,local[1]+node.y,local[2]+node.z];
const apply=(local,node,w,h,orbit,tilt)=>{
  const p=vertex(local,node);return projected(...p,w,h,orbit,tilt);
};

function paint2D(ctx,canvas,nodes,active,hover,orbit,tilt,frameHeight){
  const w=canvas.clientWidth||canvas.width, h=frameHeight;
  ctx.clearRect(0,0,w,canvas.clientHeight||canvas.height);
  for(let i=N-1;i>=0;i--){
    const n=nodes[i];if(n.alpha<.004)continue;
    const isActive=i===active;const rgba=k=>{
      const v=FACE_COLORS[isActive?'active':'inactive'][k];
      return `rgba(${Math.round(v[0]*255)},${Math.round(v[1]*255)},${Math.round(v[2]*255)},${v[3]*n.alpha})`;
    };
    for(const face of FACES){
      const points=face.poly.map(p=>apply(p,n,w,h,orbit,tilt));
      ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
      points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
      if(face.name==='top'){
        // Glass: internal surface remains visible, with a small cool glint.
        const g=ctx.createLinearGradient(points[0].x,points[0].y,points[2].x,points[2].y);
        g.addColorStop(0,isActive?`rgba(21,49,109,${.77*n.alpha})`:`rgba(14,28,73,${.63*n.alpha})`);
        g.addColorStop(.57,isActive?`rgba(17,78,133,${.68*n.alpha})`:`rgba(15,46,99,${.60*n.alpha})`);
        g.addColorStop(1,isActive?`rgba(16,40,103,${.78*n.alpha})`:`rgba(12,23,70,${.69*n.alpha})`);
        ctx.fillStyle=g;
      } else if(face.name==='front'){
        const g=ctx.createLinearGradient(points[0].x,points[0].y,points[3].x,points[3].y);
        g.addColorStop(0,isActive?`rgba(37,126,180,${.94*n.alpha})`:`rgba(29,68,132,${.87*n.alpha})`);
        g.addColorStop(1,isActive?`rgba(21,75,140,${.97*n.alpha})`:`rgba(21,38,93,${.93*n.alpha})`);
        ctx.fillStyle=g;
      } else ctx.fillStyle=rgba(face.name);
      ctx.fill();
    }
    // Delicate perspective-aligned inner technical line as in supplied reference.
    const a=apply([-.68,.003,.22],n,w,h,orbit,tilt), b=apply([.78,.003,.22],n,w,h,orbit,tilt);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineWidth=isActive?2.1:1.5;
    ctx.strokeStyle=isActive?`rgba(97,196,244,${.52*n.alpha})`:`rgba(83,119,188,${.30*n.alpha})`;ctx.stroke();
    const edgePts=[[-1,0,0],[1,0,0],[1,0,1],[-1,0,1]].map(p=>apply(p,n,w,h,orbit,tilt));
    ctx.beginPath();ctx.moveTo(edgePts[0].x,edgePts[0].y);
    edgePts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
    ctx.lineJoin='miter';ctx.lineWidth=isActive?2.2:1.05;
    if(isActive){ctx.shadowColor='rgba(73,182,247,.46)';ctx.shadowBlur=13;}
    ctx.strokeStyle=isActive?`rgba(117,213,253,${.99*n.alpha})`:`rgba(93,136,202,${.50*n.alpha})`;ctx.stroke();
    ctx.shadowBlur=0;
    if(isActive){
      const dot=apply([.51,.015,.70],n,w,h,orbit,tilt);
      ctx.beginPath();ctx.ellipse(dot.x,dot.y,4.2,4.2,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(184,228,255,${n.alpha*.9})`;ctx.shadowBlur=11;ctx.shadowColor='#65bff1';ctx.fill();ctx.shadowBlur=0;
    }
  }
}

/** WebGL meshes are the same five faces used by paint2D, not separate art. */
function initGL(gl){
  const vs=`attribute vec3 aPos; uniform mat4 uProjection; uniform mat4 uModel;uniform float uOrbit;uniform float uTilt;uniform float uFrameExtent;
    void main(){vec4 p=uModel*vec4(aPos,1.0);
      float sx=.4075+.2805*p.x+(.121+.018*p.x+uOrbit*.055)*p.z-.013*p.y;
      float sy=.228-.040*p.x+(.140-.009*p.x+uTilt*.040)*p.z-.099*p.y;
      gl_Position=uProjection*vec4(2.0*sx-1.0,1.0-2.0*sy/uFrameExtent,0.0,1.0);}`;
  const fs=`precision mediump float;uniform vec4 uColor;
    void main(){gl_FragColor=uColor;}`;
  const make=(kind,src)=>{const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const shader=gl.createProgram();gl.attachShader(shader,make(gl.VERTEX_SHADER,vs));gl.attachShader(shader,make(gl.FRAGMENT_SHADER,fs));gl.linkProgram(shader);
  if(!gl.getProgramParameter(shader,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(shader));
  const loc={pos:gl.getAttribLocation(shader,'aPos'),proj:gl.getUniformLocation(shader,'uProjection'),model:gl.getUniformLocation(shader,'uModel'),color:gl.getUniformLocation(shader,'uColor'),orbit:gl.getUniformLocation(shader,'uOrbit'),tilt:gl.getUniformLocation(shader,'uTilt'),extent:gl.getUniformLocation(shader,'uFrameExtent')};
  const buffer=gl.createBuffer();
  const data=FACES.map(f=>new Float32Array([0,1,2,0,2,3].flatMap(k=>f.poly[k])));
  const outline=new Float32Array([0,1,1,2,2,3,3,0].flatMap(k=>FACES[4].poly[k]));
  const sliver=new Float32Array([[-.68,.003,.22],[.78,.003,.22]].flat());
  const matrix=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const model=n=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,n.x,n.y,n.z,1]);
  const bind=data=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.pos);};
  function render(w,h,nodes,active,orbit,tilt){
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(shader);gl.uniformMatrix4fv(loc.proj,false,matrix());gl.uniform1f(loc.orbit,orbit);gl.uniform1f(loc.tilt,tilt);gl.uniform1f(loc.extent,FRAME_EXTENT);
    for(let i=N-1;i>=0;i--){
      const node=nodes[i];if(node.alpha<.004)continue;
      const selected=i===active;
      gl.uniformMatrix4fv(loc.model,false,model(node));
      FACES.forEach((face,k)=>{
        bind(data[k]);const v=FACE_COLORS[selected?'active':'inactive'][face.name];
        gl.uniform4f(loc.color,v[0],v[1],v[2],v[3]*node.alpha);
        gl.drawArrays(gl.TRIANGLES,0,6);
      });
      bind(sliver);gl.uniform4f(loc.color,selected?.40:.25,selected?.78:.40,selected?.98:.64,node.alpha*(selected?.52:.24));gl.drawArrays(gl.LINES,0,2);
      bind(outline);const c=lineColors[selected?'active':'inactive'];gl.uniform4f(loc.color,...c.slice(0,3),c[3]*node.alpha);gl.drawArrays(gl.LINES,0,8);
    }
  }
  return {render,destroy(){gl.deleteBuffer(buffer);gl.deleteProgram(shader)}};
}

export function mountExperienceStack3D(cards,onPick){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.createElement('canvas');
  canvas.className='stack3d-canvas';canvas.setAttribute('role','group');canvas.tabIndex=0;
  canvas.setAttribute('aria-label','3D Career Stack. Use Left or Right arrows to navigate the seven experiences; Home and End jump to the first and final layers. Drag to rotate.');
  let gl=null,renderer=null,ctx=null;
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true});if(gl)renderer=initGL(gl);}catch(err){console.warn('Using visual-equivalent 2D glass renderer:',err);gl=null;}
  if(!renderer){try{ctx=canvas.getContext('2d');}catch{} }
  if(!renderer&&!ctx)return {available:false,select(){},destroy(){}};
  cards.prepend(canvas);cards.classList.add('is-webgl-stack');
  // Only the active label is shown; hidden labels remain present and readable by
  // assistive technology and the visible keyboard controls provide navigation.
  const buttons=[...cards.querySelectorAll('[data-journey-map]')];
  const nodes=Array.from({length:N},(_,i)=>({...offsetFor(i,0,true)}));
  let active=0,peel=true,raf=0,last=0,orbit=0,orbitAim=0,tilt=0,tiltAim=0,rect=null,down=null,moved=false;
  const size=()=>{rect=canvas.getBoundingClientRect();return rect};
  function draw(){
    const r=size();if(!r.width||!r.height)return;
    const sceneHeight=r.height/FRAME_EXTENT;
    const dpr=Math.min(devicePixelRatio||1,1.65);
    const ww=Math.round(r.width*dpr),hh=Math.round(r.height*dpr);
    if(canvas.width!==ww||canvas.height!==hh){canvas.width=ww;canvas.height=hh;}
    if(ctx){ctx.setTransform(dpr,0,0,dpr,0,0);paint2D(ctx,canvas,nodes,active,-1,orbit,tilt,sceneHeight);}
    else renderer.render(r.width,r.height,nodes,active,orbit,tilt);
    buttons.forEach((b,i)=>{
      const n=nodes[i];
      // Bind each small index to the FRONT FACE of its own physical plate.
      // Selected headings remain screen-space HTML on their active plate.
      // Unlike M6.22, there is no label-only collision correction: plate pitch
      // itself is uniform, so numbers inherit the exact geometric spacing.
      const selected=i===active;
      const titleX=selected&&!peel&&i>0?-.13:-.55;
      const local=selected?[titleX,.045,.29]:FRONT_INDEX_ANCHOR;
      const p=projected(n.x+local[0],n.y+local[1],n.z+local[2],r.width,sceneHeight,orbit,tilt);
      const boxWidth=Math.min(r.width<480?210:300,r.width*(r.width<480?.78:.43));
      const px=clamp(p.x,selected?8:12,r.width-(selected?boxWidth:20)-8);
      const py=clamp(p.y,selected?39:13,r.height-(selected?46:13));
      b.style.left=`${px.toFixed(2)}px`;b.style.top=`${py.toFixed(2)}px`;
      b.style.setProperty('--stack-label-x',`${px.toFixed(2)}px`);
      b.style.setProperty('--stack-label-y',`${py.toFixed(2)}px`);
      b.style.setProperty('--stack-nameplate-width',`${boxWidth.toFixed(2)}px`);
      b.style.setProperty('--stack3d-alpha',String(n.alpha));
      b.style.setProperty('--stack3d-scale','1');
      b.classList.toggle('stack3d-current',selected);
      b.classList.toggle('stack3d-index-only',!selected);
    });
  }
  function frame(t){
    const dt=last?Math.min(60,t-last):16;last=t;
    const alpha=reduced.matches?1:1-Math.exp(-dt/165);
    let pending=false;
    for(let i=0;i<N;i++){
      const goal=offsetFor(i,active,peel);const n=nodes[i];
      for(const k of ['x','y','z','alpha']){n[k]=lerp(n[k],goal[k],alpha);if(Math.abs(n[k]-goal[k])>.002)pending=true;}
    }
    orbit=lerp(orbit,orbitAim,alpha*.7);tilt=lerp(tilt,tiltAim,alpha*.7);
    if(Math.abs(orbit-orbitAim)>.002||Math.abs(tilt-tiltAim)>.002)pending=true;
    draw();raf=pending?requestAnimationFrame(frame):0;if(!raf)last=0;
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(frame);}
  const observe=new ResizeObserver(schedule);observe.observe(cards);
  function select(index,mode){active=clamp(Math.round(index),0,N-1);peel=Boolean(mode);schedule();}
  function pick(e){
    const r=size(),x=e.clientX-r.left,y=e.clientY-r.top;
    // Back-to-front inverse hit test of each visible top face.
    for(let i=active;i<N;i++){
      const n=nodes[i];if(n.alpha<.1)continue;
      const poly=FACES[4].poly.map(pt=>apply(pt,n,r.width,r.height/FRAME_EXTENT,orbit,tilt));
      let inside=false;
      for(let j=0,k=poly.length-1;j<poly.length;k=j++){
        const pj=poly[j],pk=poly[k];if(((pj.y>y)!==(pk.y>y))&&(x<(pk.x-pj.x)*(y-pj.y)/(pk.y-pj.y)+pj.x))inside=!inside;
      }
      if(inside){onPick(i);return;}
    }
  }
  function pointerDown(e){if(e.button!==0)return;canvas.focus?.({preventScroll:true});down={x:e.clientX,y:e.clientY,orbit:orbitAim,tilt:tiltAim};moved=false;canvas.setPointerCapture?.(e.pointerId);}
  function pointermove(e){if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>6)moved=true;
    if(moved){orbitAim=clamp(down.orbit+dx*.0021,-.26,.28);tiltAim=clamp(down.tilt+dy*.003,-.25,.25);schedule();}}
  function pointerUp(e){if(!down)return;const click=!moved;down=null;if(click)pick(e);}
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointermove);canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',()=>down=null);
  canvas.addEventListener('dblclick',()=>{orbitAim=0;tiltAim=0;schedule()});
  canvas.addEventListener('webglcontextlost',evt=>{evt.preventDefault();cards.classList.remove('is-webgl-stack');});
  draw();schedule();
  return {available:true,select,destroy(){observe.disconnect();if(raf)cancelAnimationFrame(raf);renderer?.destroy();canvas.remove();cards.classList.remove('is-webgl-stack')}};
}

/** Normalized plate outlines for reproducible reference-geometry testing. */
export function stackReferenceCorners(index){
  const n=offsetFor(index,0,true);
  return FACES[4].poly.map(v=>{
    const p=projected(...vertex(v,n),1,1,0,0);
    return [p.x,p.y];
  });
}

/** Geometric front-face centerline used by indices; no CSS padding offsets. */
export function stackIndexAnchor(index,active=0,peel=true,orbit=0,tilt=0){
  const n=offsetFor(index,active,peel);
  return projected(n.x+FRONT_INDEX_ANCHOR[0],n.y+FRONT_INDEX_ANCHOR[1],
    n.z+FRONT_INDEX_ANCHOR[2],1,1,orbit,tilt);
}
/** Returns plate lower edge position after viewport fit; must stay inside view. */
export function stackPlateBottom(index,active=0,peel=true){
  const n=offsetFor(index,active,peel);
  return Math.max(...FACES.flatMap(f=>f.poly.map(p=>projected(...vertex(p,n),1,1).y)))/FRAME_EXTENT;
}
export const stackFrameExtent=FRAME_EXTENT;
