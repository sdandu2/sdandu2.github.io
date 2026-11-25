import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.pdf':'application/pdf','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||5174);
createServer(async(req,res)=>{
  try{
    const decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const raw=decoded==='/'?'index.html':decoded.replace(/^\/+/, '');
    const full=path.resolve(root,raw);
    if(!(full===root||full.startsWith(root+path.sep))){res.writeHead(403);res.end('Forbidden');return;}
    const s=await stat(full);if(!s.isFile())throw new Error('Not file');
    res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(full));
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Portfolio v7 / Milestone 6: http://localhost:${port}/`));
