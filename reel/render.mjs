import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http'; import fs from 'fs'; import path from 'path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const types = { '.html':'text/html', '.woff2':'font/woff2', '.wav':'audio/wav' };
const srv = http.createServer((q,r)=>{ const f=path.join(dir, decodeURIComponent(q.url.split('?')[0])); if(!fs.existsSync(f)){r.writeHead(404);return r.end();} r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r); }).listen(0);
const port = srv.address().port;
const mode = process.argv[2] || 'stills';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1920,height:1080}, deviceScaleFactor:1 });
page.on('pageerror', e=>console.error('PAGE ERROR', e.message));
page.on('console', m=>{ if(m.type()==='error') console.error('console', m.text()); });
await page.goto(`http://localhost:${port}/index.html?render`);
await page.waitForFunction(()=>window.READY===true, null, {timeout:20000});
const clip={x:0,y:0,width:1920,height:1080};
if (mode==='stills') {
  const ts=(process.argv[3]||'0.3,0.7,1.2,1.6,1.95,2.6,3.3,3.6,4.0,4.35,4.65,5.4,6.2,6.9,7.3,7.8,8.3,8.8,9.3,9.6,10.4,11.3,11.8,12.4,12.9,13.25,13.8,14.3,14.95').split(',').map(Number);
  fs.mkdirSync(path.join(dir,'stills'),{recursive:true});
  for (const t of ts) { await page.evaluate(i=>renderFrame(i, 1), Math.round(t*60)); await page.screenshot({ path: path.join(dir,'stills',`t${t.toFixed(2)}.png`), clip }); }
} else {
  const outFile = process.argv[3] || path.join(dir,'opentrms-reel.mp4');
  const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-framerate','60','-i','-','-i',path.join(dir,'audio.wav'),
    '-c:v','libx264','-preset','slow','-crf','14','-pix_fmt','yuv420p','-profile:v','high','-tune','film',
    '-c:a','aac','-b:a','256k','-shortest','-movflags','+faststart', outFile], { stdio:['pipe','inherit','inherit'] });
  const t0=Date.now();
  for (let i=0;i<900;i++) {
    const t=i/60, fast=[[0.45,0.7],[0.95,1.2],[1.45,1.7],[1.8,2.25],[2.1,2.7],[4.2,4.55],[4.5,5.3],[6.8,7.05],[7.48,7.72],[7.98,8.22],[8.48,8.72],[8.98,9.22],[9.48,9.72],[11.65,12.1],[13.15,13.35]].some(([a,b])=>t>=a&&t<=b);
    await page.evaluate(([i,n])=>renderFrame(i, n), [i, fast?16:6]);
    const buf = await page.screenshot({ type:'png', clip });
    if (!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain', r));
    if (i%60===0) console.log(`frame ${i}/900  ${((Date.now()-t0)/1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r=>ff.on('close', r));
  console.log('done', outFile);
}
await browser.close(); srv.close();
