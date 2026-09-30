// Copies Inter + JetBrains Mono from the site's @fontsource packages into reel/fonts/.
import fs from 'fs';
const src = new URL('../node_modules/@fontsource/', import.meta.url), dst = new URL('./fonts/', import.meta.url);
fs.mkdirSync(dst, { recursive: true });
for (const w of [400, 500, 600, 700, 800]) fs.copyFileSync(new URL(`inter/files/inter-latin-${w}-normal.woff2`, src), new URL(`inter-${w}.woff2`, dst));
for (const w of [400, 500, 700]) fs.copyFileSync(new URL(`jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff2`, src), new URL(`jbm-${w}.woff2`, dst));
console.log('fonts copied to reel/fonts/');
