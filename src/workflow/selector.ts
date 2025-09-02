import { Selector } from './types'

export function buildSelector(el: Element): Selector {
  // Prefer stable attributes
  const attrKeys = ['data-testid','data-qa','data-test','aria-label','name','role','id']
  for (const key of attrKeys) {
    const val = el.getAttribute(key)
    if (val && key === 'id') return { css: `#${cssEscape(val)}` }
    if (val) return { css: `[${key}="${cssEscape(val)}"]` }
  }
  // Tag with classes (limited)
  const tag = el.tagName.toLowerCase()
  const classList = Array.from(el.classList).slice(0, 2).map(c => `.${cssEscape(c)}`).join('')
  let css = `${tag}${classList}`
  // Fallback nth-of-type path
  const path = nthOfTypePath(el)
  if (path) css = path
  // Optional text hint
  const text = (el.textContent || '').trim().slice(0, 64)
  return text ? { css, text } : { css }
}

export function querySelectorBest(sel?: Selector): Element | null {
  if (!sel) return null
  if (sel.css) {
    const el = document.querySelector(sel.css)
    if (el) return el
  }
  // crude text contains fallback
  if (sel.text) {
    const candidates = Array.from(document.querySelectorAll('*'))
    return candidates.find(e => (e.textContent || '').includes(sel.text!)) || null
  }
  return null
}

function nthOfTypePath(el: Element): string {
  const parts: string[] = []
  let node: Element | null = el
  while (node && node.nodeType === 1 && node !== document.body) {
    const tag = node.tagName.toLowerCase()
    const idx = indexWithinType(node)
    parts.unshift(`${tag}:nth-of-type(${idx})`)
    node = node.parentElement
  }
  return parts.length ? parts.join(' > ') : ''
}

function indexWithinType(el: Element): number {
  const tag = el.tagName
  let i = 0
  let idx = 0
  const parent = el.parentElement
  if (!parent) return 1
  for (const child of Array.from(parent.children)) {
    if (child.tagName === tag) {
      i++
      if (child === el) idx = i
    }
  }
  return idx || 1
}

function cssEscape(val: string): string {
  return val.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~ ])/g, '\\$1')
}


