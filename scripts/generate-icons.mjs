// One-off/dev tool: rasterizes public/icons/source-icon*.svg into the PNG
// sizes referenced by manifest.webmanifest and index.html. Re-run this
// whenever the source SVGs change: `node scripts/generate-icons.mjs`
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '..', 'public', 'icons')

const jobs = [
  { src: 'source-icon.svg', out: 'icon-192.png', size: 192 },
  { src: 'source-icon.svg', out: 'icon-512.png', size: 512 },
  { src: 'source-icon.svg', out: 'apple-touch-icon.png', size: 180 },
  { src: 'source-icon-maskable.svg', out: 'icon-maskable-192.png', size: 192 },
  { src: 'source-icon-maskable.svg', out: 'icon-maskable-512.png', size: 512 },
]

for (const job of jobs) {
  const inputPath = path.join(iconsDir, job.src)
  const outputPath = path.join(iconsDir, job.out)
  await sharp(inputPath).resize(job.size, job.size).png().toFile(outputPath)
  console.log(`wrote ${job.out}`)
}
