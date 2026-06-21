/**
 * Gera OG images para cada post do Jekyll.
 * Saída: _site/assets/og/YYYY-MM-DD-slug.png  +  default.png
 *
 * Depende de: @resvg/resvg-js, gray-matter
 * Executar após `jekyll build`.
 */

import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')
const POSTS_DIR = path.join(ROOT, '_posts')
const OUT_DIR   = path.join(ROOT, '_site', 'assets', 'og')

// ── Tokens (espelho do tokens.css tema dev) ───────────────────────────

const T = {
  surfaceBase:    '#0d1117',
  surfaceRaised:  '#161b22',
  surfaceOverlay: '#1c2128',
  textPrimary:    '#f0f6fc',
  textSecondary:  '#e6edf3',
  textTertiary:   '#8b949e',
  textMuted:      '#484f58',
  accent:         '#3fb950',
  link:           '#58a6ff',
  borderDefault:  '#30363d',
  borderAccent:   '#3fb950',
  warning:        '#d29922',
  error:          '#f85149',
  infoText:       '#79c0ff',
}

const COLOR_MAP = {
  green:  T.accent,
  blue:   T.link,
  yellow: T.warning,
  red:    T.error,
  purple: T.infoText,
}

// ── Helpers ───────────────────────────────────────────────────────────

function x(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapTitle(text, maxChars = 38) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars) {
      if (current) lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3) // max 3 linhas
}

function slugFromFile(filename) {
  return path.basename(filename, '.md')
}

// ── SVG template ──────────────────────────────────────────────────────

function buildSVG({ title, dateStr, category, color, isDefault = false }) {
  const titleColor  = COLOR_MAP[color] || T.textPrimary
  const titleLines  = isDefault ? ['neylon.dev'] : wrapTitle(title)
  const promptCmd   = isDefault
    ? '$ ls -la posts/'
    : `$ cat "${x(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 36))}.md"`

  const TITLE_X     = 80
  const TITLE_Y     = 280
  const LINE_HEIGHT = 58

  const titleSVG = titleLines.map((line, i) => `
    <text
      x="${TITLE_X}" y="${TITLE_Y + i * LINE_HEIGHT}"
      font-family="JetBrains Mono, Fira Code, Courier New, monospace"
      font-size="40" font-weight="700"
      fill="${titleColor}">${x(line)}</text>`
  ).join('')

  const metaY = TITLE_Y + titleLines.length * LINE_HEIGHT + 28
  const tagW  = category ? category.length * 10 + 28 : 0

  const metaSVG = !isDefault ? `
    <text
      x="${TITLE_X}" y="${metaY}"
      font-family="JetBrains Mono, Fira Code, Courier New, monospace"
      font-size="18"
      fill="${T.textTertiary}">// ${x(dateStr)}</text>
    <rect
      x="${TITLE_X}" y="${metaY + 14}" width="${tagW}" height="28"
      fill="${T.surfaceRaised}" stroke="${T.borderDefault}" stroke-width="1" rx="2"/>
    <text
      x="${TITLE_X + 12}" y="${metaY + 33}"
      font-family="JetBrains Mono, Fira Code, Courier New, monospace"
      font-size="15"
      fill="${T.textTertiary}">[${x(category)}]</text>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">

  <!-- bg -->
  <rect width="1200" height="630" fill="${T.surfaceBase}"/>

  <!-- card border -->
  <rect x="32" y="32" width="1136" height="566"
        fill="${T.surfaceBase}" stroke="${T.borderDefault}" stroke-width="1"/>

  <!-- accent top bar -->
  <rect x="32" y="32" width="1136" height="3" fill="${T.accent}"/>

  <!-- prompt -->
  <text x="${TITLE_X}" y="118"
        font-family="JetBrains Mono, Fira Code, Courier New, monospace"
        font-size="20">
    <tspan fill="${T.accent}">visitante</tspan><tspan fill="${T.textTertiary}">@</tspan><tspan fill="${T.link}">neylon.dev</tspan><tspan fill="${T.textSecondary}"> ${promptCmd}</tspan>
  </text>

  <!-- divider -->
  <line x1="${TITLE_X}" y1="148" x2="1120" y2="148"
        stroke="${T.borderDefault}" stroke-width="1"/>

  <!-- title -->
  ${titleSVG}

  <!-- meta -->
  ${metaSVG}

  <!-- footer domain -->
  <text x="${TITLE_X}" y="562"
        font-family="JetBrains Mono, Fira Code, Courier New, monospace"
        font-size="17" fill="${T.textMuted}">neylon.dev</text>

  <!-- status dot -->
  <circle cx="1106" cy="556" r="7"  fill="${T.accent}"/>
  <circle cx="1106" cy="556" r="14" fill="none" stroke="${T.accent}" stroke-width="1" opacity="0.35"/>

</svg>`
}

// ── Render SVG → PNG ──────────────────────────────────────────────────

function svgToPng(svgStr) {
  const resvg = new Resvg(svgStr, {
    font: { loadSystemFonts: true },
    fitTo: { mode: 'width', value: 1200 },
  })
  return resvg.render().asPng()
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Ignora rascunhos (_prefixo) — mesmo comportamento do Jekyll
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'))
  let count = 0

  for (const file of posts) {
    const raw      = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data } = matter(raw)

    // Jekyll usa date do frontmatter, slug do nome do arquivo (sem prefixo de data)
    const filenameSlug = slugFromFile(file).replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const dateObj      = data.date ? new Date(data.date) : null
    const datePrefix   = dateObj ? dateObj.toISOString().slice(0, 10) : slugFromFile(file).slice(0, 10)
    const ogFilename   = `${datePrefix}-${filenameSlug}`
    const outPath      = path.join(OUT_DIR, `${ogFilename}.png`)

    const dateStr = dateObj
      ? dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
      : ''

    const svg = buildSVG({
      title:    data.title    || 'Post',
      dateStr,
      category: data.category || '',
      color:    data.color    || 'green',
    })

    fs.writeFileSync(outPath, svgToPng(svg))
    console.log(`  ✓ ${ogFilename}.png`)
    count++
  }

  // Imagem padrão (home, sobre, stats)
  const defaultSvg = buildSVG({ title: '', dateStr: '', category: '', color: '', isDefault: true })
  fs.writeFileSync(path.join(OUT_DIR, 'default.png'), svgToPng(defaultSvg))
  console.log(`  ✓ default.png`)

  console.log(`\nOG images: ${count + 1} geradas em _site/assets/og/`)
}

main().catch(err => { console.error(err); process.exit(1) })
