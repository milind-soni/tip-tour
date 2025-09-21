import { SmoothCursor } from './SmoothCursor'
import { Point } from './TooltipPoint'
import { TipTourOptions, TooltipState, ArrowOptions } from '../types'
// CSS is imported in layout.tsx

type NormalizedOptions = Omit<Required<TipTourOptions>, 'arrow'> & {
  arrow: ArrowOptions
}

const DEFAULT_OFFSET = { x: 20, y: 20 }
const DEFAULT_POINT = { x: 0, y: 0 }

function ensureContainer(container?: HTMLElement): HTMLElement {
  if (container) return container
  if (typeof document !== 'undefined') return document.body
  throw new Error('TipTour requires a DOM environment')
}

function normalizeArrow(arrow?: boolean | ArrowOptions): ArrowOptions {
  if (typeof arrow === 'boolean') {
    return { enabled: arrow }
  }
  if (arrow) {
    return {
      enabled: arrow.enabled ?? true,
      color: arrow.color,
      size: arrow.size,
      targets: arrow.targets
    }
  }
  return { enabled: false }
}

function normalizeOptions(options: TipTourOptions = {}): NormalizedOptions {
  const container = ensureContainer(options.container)
  return {
    enabled: options.enabled ?? true,
    smoothRadius: options.smoothRadius ?? 30,
    friction: options.friction ?? 0.92,
    offset: {
      x: options.offset?.x ?? DEFAULT_OFFSET.x,
      y: options.offset?.y ?? DEFAULT_OFFSET.y
    },
    initialPoint: {
      x: options.initialPoint?.x ?? DEFAULT_POINT.x,
      y: options.initialPoint?.y ?? DEFAULT_POINT.y
    },
    className: options.className ?? 'tiptour-tooltip',
    zIndex: options.zIndex ?? 10000,
    hideDelay: options.hideDelay ?? 5000,
    showDelay: options.showDelay ?? 0,
    container,
    arrow: normalizeArrow(options.arrow),
    onShow: options.onShow ?? (() => {}),
    onHide: options.onHide ?? (() => {}),
    onUpdate: options.onUpdate ?? (() => {})
  }
}

export class TipTour {
  private smoothCursor: SmoothCursor
  private tooltip: HTMLElement
  private tooltipMessage: HTMLElement
  private tooltipInput: HTMLInputElement | null = null
  private arrow: HTMLElement | null = null
  private arrowTargets: HTMLElement[] = []

  private options: NormalizedOptions
  private state: TooltipState

  private rafId: number | null = null
  private hideTimeout: number | null = null
  private showTimeout: number | null = null
  private lastMouseEvent: MouseEvent | null = null
  private lastUpdateAt = 0

  private onInputHandler?: (value: string) => void
  
  constructor(options: TipTourOptions = {}) {
    this.options = normalizeOptions(options)

    this.state = {
      visible: false,
      x: this.options.initialPoint.x,
      y: this.options.initialPoint.y,
      content: '',
      isLoading: false
    }
    
    this.smoothCursor = new SmoothCursor({
      radius: this.options.smoothRadius,
      friction: this.options.friction,
      enabled: this.options.enabled,
      initialPoint: this.options.initialPoint
    })

    const { tooltip, message } = this.createTooltipElement()
    this.tooltip = tooltip
    this.tooltipMessage = message

    this.init()
  }

  private createTooltipElement(): { tooltip: HTMLElement; message: HTMLElement } {
    const tooltip = document.createElement('div')
    tooltip.className = this.options.className
    tooltip.style.zIndex = this.options.zIndex.toString()

    const message = document.createElement('div')
    message.className = 'tiptour-message'
    tooltip.appendChild(message)

    this.options.container.appendChild(tooltip)
    return { tooltip, message }
  }

  private createArrow(): void {
    if (this.arrow) return

    const { color = '#1a1a1a', size = 24 } = this.options.arrow
    this.arrow = document.createElement('div')
    this.arrow.className = 'tiptour-arrow'
    this.arrow.innerHTML = `
      <div class="tiptour-arrow-svg">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
          <path class="tiptour-arrow-path" d="M8 4 L16 12 L8 20" 
                stroke="${color}" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
        </svg>
      </div>
    `
    this.tooltip.appendChild(this.arrow)
  }

  private init(): void {
    if (this.options.enabled) {
      this.enable()
    }

    if (this.options.arrow.enabled) {
      this.createArrow()
    }
  }

  private startAnimationLoop(): void {
    const loop = () => {
      if (this.lastMouseEvent && this.state.visible) {
        this.updatePosition(this.lastMouseEvent)
      }
      this.rafId = requestAnimationFrame(loop)
    }
    loop()
  }
  
  private stopAnimationLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.lastMouseEvent = e

    if (this.showTimeout) {
      clearTimeout(this.showTimeout)
    }

    if (!this.state.visible) {
      this.showTimeout = window.setTimeout(() => {
        this.show()
      }, this.options.showDelay)
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }

    if (!this.tooltipInput || document.activeElement !== this.tooltipInput) {
      this.hideTimeout = window.setTimeout(() => {
        this.hide()
      }, this.options.hideDelay)
    }
  }
  
  private updatePosition(e: MouseEvent): void {
    const mousePoint = { x: e.clientX, y: e.clientY }
    
    this.smoothCursor.update(mousePoint)
    
    if (this.smoothCursor.hasMoved()) {
      const smoothPos = this.smoothCursor.getSmoothPosition()
      this.state.x = smoothPos.x
      this.state.y = smoothPos.y
      
      this.updateTooltipPosition()
      this.updateArrow()
      const now = performance.now()
      if (now - this.lastUpdateAt >= 16) { // ~60fps throttle
        this.lastUpdateAt = now
        this.options.onUpdate(smoothPos)
      }
    }
  }
  
  private updateTooltipPosition(): void {
    const offset = this.options.offset
    const tooltipWidth = this.tooltip.offsetWidth
    const tooltipHeight = this.tooltip.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    let left = this.state.x + offset.x
    let top = this.state.y + offset.y
    
    if (left + tooltipWidth > windowWidth) {
      left = this.state.x - tooltipWidth - offset.x
    }
    
    if (top + tooltipHeight > windowHeight) {
      top = this.state.y - tooltipHeight - offset.y
    }
    
    left = Math.max(10, left)
    top = Math.max(10, top)
    
    this.tooltip.style.transform = `translate(${left}px, ${top}px)`
  }
  
  private updateArrow(): void {
    if (!this.arrow || !this.options.arrow.enabled || this.arrowTargets.length === 0) return

    const tooltipRect = this.tooltip.getBoundingClientRect()
    const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2
    const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2
    
    let closestTarget = this.arrowTargets[0]
    let minDistance = Infinity
    
    for (const target of this.arrowTargets) {
      const targetRect = target.getBoundingClientRect()
      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2
      
      const distance = Math.sqrt(
        Math.pow(targetCenterX - tooltipCenterX, 2) +
        Math.pow(targetCenterY - tooltipCenterY, 2)
      )
      
      if (distance < minDistance) {
        minDistance = distance
        closestTarget = target
      }
    }
    
    const targetRect = closestTarget.getBoundingClientRect()
    const targetCenterX = targetRect.left + targetRect.width / 2
    const targetCenterY = targetRect.top + targetRect.height / 2
    
    const deltaX = targetCenterX - tooltipCenterX
    const deltaY = targetCenterY - tooltipCenterY
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    
    const arrowSvg = this.arrow.querySelector('.tiptour-arrow-svg') as HTMLElement
    if (arrowSvg) {
      let scale = 1
      if (minDistance < 50) scale = 1.4
      else if (minDistance < 100) scale = 1.3
      else if (minDistance < 150) scale = 1.2
      else if (minDistance < 250) scale = 1.1

      arrowSvg.style.transform = `rotate(${angle}deg) scale(${scale})`
    }
  }

  enable(): void {
    this.smoothCursor.enable()
    document.addEventListener('mousemove', this.handleMouseMove)
    this.options.enabled = true
  }
  
  disable(): void {
    this.smoothCursor.disable()
    document.removeEventListener('mousemove', this.handleMouseMove)
    this.options.enabled = false
    this.hide()
  }
  
  show(): void {
    if (!this.state.visible) {
      this.state.visible = true
      this.tooltip.classList.add('visible')
      if (this.rafId === null) this.startAnimationLoop()
      this.options.onShow()
    }
  }
  
  hide(): void {
    if (this.tooltipInput && document.activeElement === this.tooltipInput) {
      return
    }
    
    if (this.state.visible) {
      this.state.visible = false
      this.tooltip.classList.remove('visible')
      this.stopAnimationLoop()
      this.options.onHide()
    }
  }
  
  setContent(content: string): void {
    this.state.content = content
    this.tooltipMessage.innerHTML = this.sanitizeHTML(content)
    this.state.isLoading = false
  }

  setMessage(message: string): void {
    this.tooltipMessage.textContent = message
    this.state.isLoading = false
  }
  
  setLoading(isLoading: boolean): void {
    this.state.isLoading = isLoading
    if (isLoading) {
      this.tooltipMessage.innerHTML = '<div class="tiptour-loading">Loading...</div>'
    }
  }

  addInput(placeholder: string = 'Type here...', onInput?: (value: string) => void): void {
    if (this.tooltipInput) return
    
    const divider = document.createElement('div')
    divider.className = 'tiptour-divider'
    this.tooltip.appendChild(divider)
    
    this.tooltipInput = document.createElement('input')
    this.tooltipInput.type = 'text'
    this.tooltipInput.className = 'tiptour-input'
    this.tooltipInput.placeholder = placeholder
    this.tooltip.appendChild(this.tooltipInput)
    
    this.onInputHandler = onInput
    
    this.tooltipInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.onInputHandler) {
        const value = this.tooltipInput!.value.trim()
        if (value) {
          this.onInputHandler(value)
          this.tooltipInput!.value = ''
        }
      }
    })
    
    this.tooltipInput.addEventListener('focus', () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout)
        this.hideTimeout = null
      }
    })
    
    this.tooltipInput.addEventListener('blur', () => {
      if (!this.tooltipInput!.value.trim()) {
        this.hideTimeout = window.setTimeout(() => {
          this.hide()
        }, this.options.hideDelay)
      }
    })
  }

  addArrow(targets: string[] | HTMLElement[]): void {
    if (!this.options.arrow.enabled) {
      this.options.arrow.enabled = true
      if (!this.arrow) {
        this.createArrow()
      }
    }

    if (targets.length > 0 && typeof targets[0] === 'string') {
      this.arrowTargets = (targets as string[])
        .map(selector => document.querySelector(selector) as HTMLElement | null)
        .filter((el): el is HTMLElement => Boolean(el))
    } else {
      this.arrowTargets = targets as HTMLElement[]
    }
  }

  getSmoothCursor(): SmoothCursor {
    return this.smoothCursor
  }
  
  setFriction(friction: number): void {
    this.options.friction = friction
    this.smoothCursor.setFriction(friction)
  }
  
  setSmoothRadius(radius: number): void {
    this.options.smoothRadius = radius
    this.smoothCursor.setRadius(radius)
  }
  
  reset(point?: Point): void {
    this.smoothCursor.reset(point)
    if (point) {
      this.state.x = point.x
      this.state.y = point.y
    }
  }
  
  destroy(): void {
    this.disable()
    this.stopAnimationLoop()
    if (this.tooltip.parentElement) {
      this.tooltip.parentElement.removeChild(this.tooltip)
    }

    if (this.hideTimeout) clearTimeout(this.hideTimeout)
    if (this.showTimeout) clearTimeout(this.showTimeout)
  }

  private sanitizeHTML(html: string): string {
    try {
      const template = document.createElement('template')
      template.innerHTML = html
      const scripts = template.content.querySelectorAll('script')
      scripts.forEach(s => s.remove())
      const all = template.content.querySelectorAll('*')
      all.forEach(el => {
        // remove inline event handlers
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.toLowerCase().startsWith('on')) {
            el.removeAttribute(attr.name)
          }
        })
      })
      return template.innerHTML
    } catch {
      return ''
    }
  }
}
