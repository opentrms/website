// Synthesizes the reel soundtrack, sample-locked to the visual timeline (120 BPM).
import fs from 'fs';
const SR = 48000, DUR = 15, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N), RV = new Float32Array(N);
let seed = 12345; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
const S = t => Math.round(t * SR);
function out(i, v, pan = 0, rev = 0) { if (i < 0 || i >= N) return; const a = (pan + 1) * Math.PI / 4;
  L[i] += v * Math.cos(a) * 1.414; R[i] += v * Math.sin(a) * 1.414; if (rev) RV[i] += v * rev; }
class BP { constructor() { this.z1 = 0; this.z2 = 0; }  // state-variable bandpass
  run(x, f, q) { const F = 2 * Math.sin(Math.PI * Math.min(f, SR / 6) / SR); const hp = x - this.z2 - q * this.z1;
    this.z1 += F * hp; this.z2 += F * this.z1; return { bp: this.z1, lp: this.z2, hp }; } }

const kicks = [];
function kick(t0, amp = 1) { kicks.push(t0); let ph = 0; for (let n = 0; n < SR * 0.5; n++) { const t = n / SR;
  ph += 2 * Math.PI * (44 + 120 * Math.exp(-t * 32)) / SR; const v = Math.sin(ph) * Math.exp(-t * 6.5) + rnd() * Math.exp(-t * 400) * 0.25;
  out(S(t0) + n, v * amp * 0.9); } }
function boom(t0, amp = 1, dur = 2.5) { let ph = 0; for (let n = 0; n < SR * dur; n++) { const t = n / SR;
  ph += 2 * Math.PI * (34 + 40 * Math.exp(-t * 7)) / SR; out(S(t0) + n, Math.sin(ph) * Math.exp(-t * 1.7) * amp); } }
function clap(t0, amp = 0.5, pan = 0) { const f = new BP(); for (let n = 0; n < SR * 0.35; n++) { const t = n / SR;
  const env = (t < 0.03 ? (Math.exp(-((t % 0.01) * 400))) : Math.exp(-(t - 0.03) * 16));
  out(S(t0) + n, f.run(rnd(), 1400, 0.9).bp * env * amp * 2.2, pan, 0.35); } }
function hat(t0, amp = 0.06, open = false, pan = 0) { let px = 0, y = 0; for (let n = 0; n < SR * (open ? 0.2 : 0.05); n++) { const t = n / SR;
  const x = rnd(); y = 0.6 * (y + x - px); px = x; out(S(t0) + n, y * Math.exp(-t * (open ? 18 : 70)) * amp, pan); } }
function tone(t0, f, dur, amp, pan = 0, rev = 0.3, type = 'sine', dec = 8) { let ph = 0; for (let n = 0; n < SR * dur; n++) { const t = n / SR;
  ph += 2 * Math.PI * f / SR; const w = type === 'sine' ? Math.sin(ph) : type === 'sq' ? Math.sign(Math.sin(ph)) * 0.5 : ((ph / Math.PI) % 2) - 1;
  const env = Math.min(1, t * 400) * Math.exp(-t * dec); out(S(t0) + n, w * env * amp, pan, rev); } }
function click(t0, amp = 0.08, pan = 0) { for (let n = 0; n < SR * 0.006; n++) out(S(t0) + n, rnd() * amp * (1 - n / (SR * 0.006)), pan, 0.1); }
function whoosh(t0, t1, amp = 0.35, f0 = 300, f1 = 6000, peak = 0.7) { const f = new BP(); const n0 = S(t0), n1 = S(t1);
  for (let n = n0; n < n1; n++) { const u = (n - n0) / (n1 - n0); const env = u < peak ? (u / peak) ** 2 : Math.exp(-(u - peak) / (1 - peak) * 4);
    const fc = f0 * (f1 / f0) ** u; out(n, f.run(rnd(), fc, 0.5).bp * env * amp * 3, lerp(-0.8, 0.8, u), 0.2); } }
const lerp = (a, b, t) => a + (b - a) * t;
function bass(t0, dur, f, amp = 0.22) { let ph = 0; const lp = new BP(); for (let n = 0; n < SR * dur; n++) { const t = n / SR; ph += 2 * Math.PI * f / SR;
  const saw = ((ph / Math.PI) % 2) - 1; const env = Math.min(1, t * 300) * Math.min(1, (dur - t) * 60) * Math.exp(-t * 3);
  out(S(t0) + n, (lp.run(saw, 380 + 900 * Math.exp(-t * 20), 1.1).lp * 0.8 + Math.sin(ph) * 0.6) * env * amp); } }
function pad(t0, t1, freqs, amp, fadeIn = 0.05, rev = 0.45) { const n0 = S(t0), n1 = Math.min(N, S(t1)); freqs.forEach((f, k) => {
  [-1, 1].forEach(d => { let ph = rnd() * 6; const lp = new BP(); const ff = f * (1 + d * 0.0025);
    for (let n = n0; n < n1; n++) { const t = (n - n0) / SR, rem = (n1 - n) / SR; ph += 2 * Math.PI * ff / SR; const saw = ((ph / Math.PI) % 2) - 1;
      const env = Math.min(1, t / fadeIn) * Math.min(1, rem / 0.35); out(n, lp.run(saw, 1400, 1.2).lp * env * amp, d * 0.5, rev); } }); }); }

/* ---------- arrangement ---------- */
boom(0.04, 0.55, 1.2); tone(0.06, 1760, 0.5, 0.05, 0, 0.6, 'sine', 5);          // dot ignites
for (let b = 1; b <= 22; b++) kick(b * 0.5, b % 4 === 0 ? 1.05 : 1);                // four-on-the-floor to 11.0
[0.5, 1.0, 1.5].forEach((t, i) => { clap(t, 0.45 + i * 0.1); whoosh(t - 0.08, t + 0.05, 0.2, 2000, 8000, 0.9); });
for (let t = 2.5; t < 11; t += 1) clap(t, 0.42);
for (let t = 2.0; t < 11; t += 0.125) { const off = Math.abs((t % 0.5) - 0.25) < 1e-6; hat(t, off ? 0.1 : 0.045, off, off ? 0.3 : -0.3); }
// bass: A F C G A, pumping 8ths with octave jumps
const roots = [[2, 55], [4, 43.65], [6, 65.41], [8, 49], [10, 55]];
roots.forEach(([bt, f]) => { for (let k = 0; k < 8; k++) { const t = bt + k * 0.25; if (t >= 11) break; bass(t, 0.22, k % 2 ? f * 2 : f); } });
roots.forEach(([bt, f]) => pad(bt, Math.min(bt + 2, 11), [f * 4, f * 5, f * 6], 0.018, 0.3, 0.5));
// transitions
whoosh(1.72, 2.1, 0.5); whoosh(4.2, 4.55, 0.55, 200, 7000, 0.85); whoosh(6.72, 7.04, 0.5, 400, 9000, 0.85);
[7.5, 8.0, 8.5, 9.0, 9.5].forEach(t => whoosh(t - 0.1, t + 0.1, 0.3, 600, 9000, 0.5));
// scene 2: card thumps, hash scramble ticks, tamper glitch, verified chime
for (let i = 0; i < 4; i++) { const t = 2.12 + i * 0.13; tone(t + 0.05, 150, 0.2, 0.3, lerp(-0.6, 0.6, i / 3), 0.2, 'sine', 18); click(t + 0.05, 0.1); }
for (let i = 0; i < 40; i++) click(2.35 + i * 0.022, 0.035, rnd() * 0.8);
{ let f = 200; for (let t = 3.52; t < 3.84; t += 0.02) { f = 100 + Math.abs(rnd()) * 900; tone(t, f, 0.02, 0.1, rnd(), 0.05, 'sq', 1); } }
tone(3.88, 1318.5, 0.9, 0.12, -0.2, 0.6, 'sine', 4); tone(3.93, 1975.5, 0.9, 0.09, 0.2, 0.6, 'sine', 4);
// scene 3: rising pentatonic ticks per lifecycle state
[0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24].forEach((s, k) => tone(4.74 + k * 0.17, 440 * 2 ** (s / 12), 0.25, 0.09, lerp(-0.5, 0.5, k / 10), 0.4, 'sine', 12));
// scene 4: odometer ratchets + EOD ticks
[7.0, 7.5, 8.0, 8.5, 9.0].forEach(t0 => { let dt = 0.012; for (let t = t0 + 0.01; t < t0 + 0.38; t += dt, dt *= 1.18) click(t, 0.07, rnd() * 0.5); tone(t0 + 0.36, 2093, 0.2, 0.05, 0, 0.3); });
for (let j = 0; j < 14; j++) tone(9.0 + 0.05 + j * 0.02, 1760 + j * 40, 0.05, 0.04, 0.4, 0.1, 'sine', 40);
// scene 5: typing, agent lines, FX highlight
for (let i = 0; i < 44; i++) click(9.86 + i / 55 + (Math.abs(rnd()) * 0.004), 0.06 + Math.abs(rnd()) * 0.03, -0.3);
[10.72, 10.9, 11.04, 11.18, 11.34].forEach((t, j) => tone(t, 1175 + j * 110, 0.1, 0.05, -0.2, 0.3, 'sine', 25));
tone(10.93, 659, 0.4, 0.08, 0.4, 0.4); tone(10.97, 988, 0.4, 0.07, 0.5, 0.4);
// build: snare roll + riser → silence → reverse swell → IMPACT
{ let t = 11.0, dt = 0.125; while (t < 11.94) { clap(t, 0.12 + (t - 11) * 0.5, rnd() * 0.3); t += dt; if (t > 11.5) dt = 0.0625; } }
whoosh(10.95, 12.0, 0.55, 200, 9000, 0.99);
{ let ph = 0; for (let n = S(10.95); n < S(12.0); n++) { const u = (n - S(10.95)) / (S(12) - S(10.95)); ph += 2 * Math.PI * (180 * 8 ** u) / SR; out(n, Math.sin(ph) * u * u * 0.08, 0, 0.3); } }
for (let i = 0; i < 70; i++) { const t = 12.0 + Math.abs(rnd()) * 1.15; tone(t, 2000 + Math.abs(rnd()) * 4000, 0.15, 0.02 + 0.03 * ((t - 12) / 1.2), rnd(), 0.7, 'sine', 30); }
whoosh(12.45, 13.2, 0.45, 150, 5000, 0.999);
kick(13.2, 1.3); boom(13.2, 0.9, 1.9); clap(13.2, 0.5);
{ const f = new BP(); for (let n = 0; n < SR * 1.8; n++) { const t = n / SR; out(S(13.2) + n, f.run(rnd(), 5000, 0.7).hp * Math.exp(-t * 2.6) * 0.16, rnd() * 0.3, 0.5); } }
pad(13.2, 15.0, [110, 164.81, 220, 277.18, 329.63, 440], 0.03, 0.04, 0.5);
[13.45, 13.57, 13.69].forEach((t, j) => tone(t, [880, 1108.7, 1318.5][j], 0.6, 0.06, [-0.4, 0, 0.4][j], 0.5, 'sine', 5));
for (let i = 0; i < 28; i++) click(14.15 + i / 70, 0.035, 0.2);

/* ---------- sidechain, reverb, master ---------- */
const combs = [1557, 1617, 1491, 1422, 1277, 1356].map(d => Math.round(d * SR / 44100));
function verb(spread) { const o = new Float32Array(N); const bufs = combs.map(d => ({ b: new Float32Array(d + spread), i: 0, lp: 0 }));
  for (let n = 0; n < N; n++) { let s = 0; for (const c of bufs) { const y = c.b[c.i]; c.lp = y * 0.6 + c.lp * 0.4; c.b[c.i] = RV[n] + c.lp * 0.8; c.i = (c.i + 1) % c.b.length; s += y; } o[n] = s / combs.length; }
  for (const d of [556, 441]) { const b = new Float32Array(Math.round(d * SR / 44100) + spread); let i = 0; for (let n = 0; n < N; n++) { const bo = b[i]; const y = -o[n] + bo; b[i] = o[n] + bo * 0.5; i = (i + 1) % b.length; o[n] = y; } }
  return o; }
const vL = verb(0), vR = verb(23);
let peak = 0; for (let n = 0; n < N; n++) { L[n] = Math.tanh((L[n] + vL[n] * 0.9) * 1.15); R[n] = Math.tanh((R[n] + vR[n] * 0.9) * 1.15); peak = Math.max(peak, Math.abs(L[n]), Math.abs(R[n])); }
const g = 0.93 / peak, fo = S(0.02);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) { const f = Math.min(1, (N - n) / fo); buf.writeInt16LE(Math.round(L[n] * g * f * 32767), 44 + n * 4); buf.writeInt16LE(Math.round(R[n] * g * f * 32767), 46 + n * 4); }
fs.writeFileSync(new URL('./audio.wav', import.meta.url), buf);
console.log('audio.wav written, peak', peak.toFixed(2));
