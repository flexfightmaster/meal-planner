// Generates the PNG icons the PWA manifest needs, with no image library:
// a mustard rounded square with a dark plate (ring) and a fork-like bar. Run: npm run icons
import { deflateSync, crc32 } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(outDir, { recursive: true })

const ACCENT = [233, 196, 106]
const DARK = [29, 29, 31]

function roundedRect(x, y, x0, y0, x1, y1, r) {
  const cx = Math.max(x0 + r, Math.min(x, x1 - r))
  const cy = Math.max(y0 + r, Math.min(y, y1 - r))
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

function render(size, { maskable }) {
  const c = size / 2
  const outer = size * (maskable ? 0.27 : 0.32)
  const inner = outer * 0.8
  const dot = outer * 0.3
  const row = new Uint8Array(1 + size * 4)
  const rows = []
  for (let y = 0; y < size; y++) {
    row[0] = 0
    for (let x = 0; x < size; x++) {
      const px = x + 0.5
      const py = y + 0.5
      let rgb = null
      let a = 0
      if (maskable || roundedRect(px, py, 0, 0, size, size, size * 0.22)) {
        rgb = ACCENT
        a = 255
        const d2 = (px - c) ** 2 + (py - c) ** 2
        if ((d2 <= outer * outer && d2 >= inner * inner) || d2 <= dot * dot) rgb = DARK
      }
      const o = 1 + x * 4
      if (rgb) {
        row[o] = rgb[0]
        row[o + 1] = rgb[1]
        row[o + 2] = rgb[2]
      } else {
        row[o] = row[o + 1] = row[o + 2] = 0
      }
      row[o + 3] = a
    }
    rows.push(Buffer.from(row))
  }
  return png(size, size, Buffer.concat(rows))
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeData) >>> 0)
  return Buffer.concat([len, typeData, crc])
}

function png(w, h, raw) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const targets = [
  ['icon-192.png', 192, { maskable: false }],
  ['icon-512.png', 512, { maskable: false }],
  ['icon-512-maskable.png', 512, { maskable: true }],
]
for (const [name, size, opts] of targets) {
  writeFileSync(join(outDir, name), render(size, opts))
  console.log('wrote', name)
}
