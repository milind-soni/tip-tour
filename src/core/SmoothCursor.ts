import { TooltipPoint, Point } from './TooltipPoint'

const RADIUS_DEFAULT = 30

interface SmoothCursorOptions {
  radius?: number
  enabled?: boolean
  initialPoint?: Point
  friction?: number
}

interface UpdateOptions {
  immediate?: boolean
  friction?: number
}

export class SmoothCursor {
  private _isEnabled: boolean
  private _hasMoved: boolean
  
  radius: number
  friction: number
  
  pointer: TooltipPoint
  smoothPosition: TooltipPoint
  
  angle: number
  distance: number
  
  constructor(options: SmoothCursorOptions = {}) {
    const initialPoint = options.initialPoint || { x: 0, y: 0 }
    this.radius = options.radius || RADIUS_DEFAULT
    this.friction = options.friction || 0.92
    this._isEnabled = options.enabled !== false
    
    this.pointer = new TooltipPoint(initialPoint.x, initialPoint.y)
    this.smoothPosition = new TooltipPoint(initialPoint.x, initialPoint.y)
    
    this.angle = 0
    this.distance = 0
    this._hasMoved = false
  }
  
  enable(): void {
    this._isEnabled = true
  }
  
  disable(): void {
    this._isEnabled = false
  }
  
  isEnabled(): boolean {
    return this._isEnabled
  }
  
  setRadius(radius: number): void {
    this.radius = radius
  }
  
  getRadius(): number {
    return this.radius
  }
  
  setFriction(friction: number): void {
    this.friction = Math.max(0, Math.min(1, friction))
  }
  
  getSmoothPosition(): Point {
    return this.smoothPosition.toObject()
  }
  
  getPointerPosition(): Point {
    return this.pointer.toObject()
  }
  
  getDistance(): number {
    return this.distance
  }
  
  getAngle(): number {
    return this.angle
  }
  
  hasMoved(): boolean {
    return this._hasMoved
  }
  
  update(newPointerPoint: Point, options: UpdateOptions = {}): boolean {
    this._hasMoved = false
    
    this.pointer.update(newPointerPoint)
    
    if (options.immediate) {
      this._hasMoved = true
      this.smoothPosition.update(newPointerPoint)
      return true
    }
    
    if (this._isEnabled) {
      this.distance = this.pointer.getDistanceTo(this.smoothPosition)
      this.angle = this.pointer.getAngleTo(this.smoothPosition)
      
      const isOutside = this.distance > this.radius
      const currentFriction = options.friction !== undefined ? options.friction : this.friction
      
      if (isOutside) {
        // Smooth movement proportional to how far outside the radius we are
        const overshoot = this.distance - this.radius
        const moveDistance = overshoot * (1 - currentFriction)
        
        this.smoothPosition.moveByAngle(
          this.angle,
          moveDistance,
          undefined // Don't apply friction twice
        )
        this._hasMoved = true
      } else if (this.distance > 0.1) {
        // Gentle drift toward center when inside radius
        this.smoothPosition.lerp(this.pointer, (1 - currentFriction) * 0.1)
        this._hasMoved = true
      }
    } else {
      this.distance = 0
      this.angle = 0
      this.smoothPosition.update(newPointerPoint)
      this._hasMoved = true
    }
    
    return true
  }
  
  reset(point?: Point): void {
    const resetPoint = point || this.pointer.toObject()
    this.pointer.update(resetPoint)
    this.smoothPosition.update(resetPoint)
    this.distance = 0
    this.angle = 0
    this._hasMoved = false
  }
}