// Checks channels.json: valid JSON, known channels, each used once, one
// source per channel, links that look right, and image files that exist.
// Run with: node scripts/check.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';

const CHANNELS = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'U1', 'U2'];
const problems = [];
let data;
try {
  data = JSON.parse(readFileSync('channels.json', 'utf8'));
} catch (e) {
  console.error(`channels.json is not valid JSON: ${e.message}\nCheck for a missing or extra comma, quote or bracket.`);
  process.exit(1);
}
const list = Array.isArray(data?.channels) ? data.channels : null;
if (!list) problems.push('channels.json needs a "channels" list: { "channels": [ ... ] }');
const seen = new Set();
for (const [i, c] of (list || []).entries()) {
  const where = `line ${i + 1} of the list`;
  const ch = String(c?.channel ?? '').toUpperCase();
  if (!CHANNELS.includes(ch)) { problems.push(`${where}: "channel" must be 3 to 13, "U1" or "U2" (got ${JSON.stringify(c?.channel)})`); continue; }
  if (seen.has(ch)) problems.push(`channel ${ch} is listed more than once`);
  seen.add(ch);
  const sources = ['youtube', 'spotify', 'image'].filter((k) => c[k]);
  if (sources.length !== 1) problems.push(`channel ${ch}: give exactly one of "youtube", "spotify" or "image"`);
  if (c.youtube && !/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(c.youtube)) problems.push(`channel ${ch}: "youtube" should be a https://www.youtube.com/... or https://youtu.be/... link`);
  if (c.spotify && !/^https:\/\/open\.spotify\.com\//.test(c.spotify)) problems.push(`channel ${ch}: "spotify" should be a https://open.spotify.com/... link`);
  if (c.image) {
    if (!/\.(gif|webp)$/i.test(c.image)) problems.push(`channel ${ch}: "image" should be a .gif or .webp file`);
    const path = `media/${c.image}`;
    if (!existsSync(path)) problems.push(`channel ${ch}: ${path} is not in the media folder (check the spelling and capitals)`);
    else if (statSync(path).size > 8 * 1024 * 1024) console.warn(`channel ${ch}: ${path} is over 8 MB and will be slow to start`);
  }
  if (c.title && String(c.title).length > 14) console.warn(`channel ${ch}: the title "${c.title}" is long and will be cut off in the guide`);
}
if (problems.length) {
  console.error(problems.map((p) => '- ' + p).join('\n'));
  process.exit(1);
}
console.log(`channels.json is fine: ${seen.size} channel${seen.size === 1 ? '' : 's'}.`);
