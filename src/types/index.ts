export interface TipTourOptions {
  enabled?: boolean
  smoothRadius?: number
  friction?: number
  offset?: { x: number; y: number }
  initialPoint?: { x: number; y: number }
  className?: string
  zIndex?: number
  hideDelay?: number
  showDelay?: number
  container?: HTMLElement
  arrow?: boolean | ArrowOptions
  onShow?: () => void
  onHide?: () => void
  onUpdate?: (position: { x: number; y: number }) => void
}

export interface ArrowOptions {
  enabled: boolean
  size?: number
  color?: string
  targets?: HTMLElement[]
}

export interface TooltipState {
  visible: boolean
  x: number
  y: number
  content: string
  isLoading: boolean
}

export interface Point {
  x: number
  y: number
}