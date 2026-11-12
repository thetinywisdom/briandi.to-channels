// Checks channels.json: valid JSON, known channels, each used once, one
// source per channel, links that look right, and image files that exist.
// Run with: node scripts/check.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';

const CHANNELS = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'U1', 'U2'];
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
  if (!CHANNELS.includes(ch)) { problems.push(`${where}: "channel" must be 3 to 12, "U1" or "U2" (1 is the guide and 2 is How to use, both built into the site) (got ${JSON.stringify(c?.channel)})`); continue; }
  if (seen.has(ch)) problems.push(`channel ${ch} is listed more than once`);
  seen.add(ch);
  const sources = ['youtube', 'spotify', 'image', 'images', 'scroll'].filter((k) => c[k]);
  if (sources.length !== 1) problems.push(`channel ${ch}: give exactly one of "youtube", "spotify", "image", "images" or "scroll"`);
  if (c.audio !== undefined) {
    if (!(c.image || c.images || c.scroll)) problems.push(`channel ${ch}: "audio" goes with "image", "images" or "scroll"`);
    if (typeof c.audio !== 'string' || !/\.(m4a|mp3|aac|ogg|opus|wav)$/i.test(c.audio)) problems.push(`channel ${ch}: "audio" should be an .m4a, .mp3, .aac, .ogg, .opus or .wav file`);
    else if (!existsSync(`media/${c.audio}`)) problems.push(`channel ${ch}: media/${c.audio} is not in the media folder (check the spelling and capitals)`);
  }
  if (c.scroll !== undefined && (!Array.isArray(c.scroll) || !c.scroll.length)) problems.push(`channel ${ch}: "scroll" should be a list of file names: [ "1.jpg", "2.jpg" ]`);
  for (const file of Array.isArray(c.scroll) ? c.scroll : []) {
    if (typeof file !== 'string' || !/\.(jpe?g|png|webp|gif)$/i.test(file)) { problems.push(`channel ${ch}: ${JSON.stringify(file)} should be a .jpg, .png, .webp or .gif file`); continue; }
    if (!existsSync(`media/${file}`)) problems.push(`channel ${ch}: media/${file} is not in the media folder (check the spelling and capitals)`);
  }
  if (c.youtube && !/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(c.youtube)) problems.push(`channel ${ch}: "youtube" should be a https://www.youtube.com/... or https://youtu.be/... link`);
  if (c.spotify && !/^https:\/\/open\.spotify\.com\//.test(c.spotify)) problems.push(`channel ${ch}: "spotify" should be a https://open.spotify.com/... link`);
  if (c.images !== undefined && (!Array.isArray(c.images) || !c.images.length)) problems.push(`channel ${ch}: "images" should be a list of file names: [ "a.gif", "b.gif" ]`);
  const files = c.image ? [c.image] : Array.isArray(c.images) ? c.images : [];
  for (const file of files) {
    if (typeof file !== 'string' || !/\.(gif|webp)$/i.test(file)) { problems.push(`channel ${ch}: ${JSON.stringify(file)} should be a .gif or .webp file`); continue; }
    const path = `media/${file}`;
    if (!existsSync(path)) problems.push(`channel ${ch}: ${path} is not in the media folder (check the spelling and capitals)`);
    else if (statSync(path).size > 8 * 1024 * 1024) console.warn(`channel ${ch}: ${path} is over 8 MB and will be slow to start`);
  }
  if (c.title && String(c.title).length > 14) console.warn(`channel ${ch}: the title "${c.title}" is long and will be cut off in the guide (the pager shows it whole)`);
}
if (problems.length) {
  console.error(problems.map((p) => '- ' + p).join('\n'));
  process.exit(1);
}
console.log(`channels.json is fine: ${seen.size} channel${seen.size === 1 ? '' : 's'}.`);
