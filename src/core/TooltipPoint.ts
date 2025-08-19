export interface Point {
  x: number
  y: number
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export class TooltipPoint implements Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(point: Point): TooltipPoint {
    this.x = point.x
    this.y = point.y
    return this
  }

  moveTowards(
    target: Point,
    speed: number = 1,
    easing: 'linear' | 'cubic' | 'expo' = 'cubic'
  ): TooltipPoint {
    const dx = target.x - this.x
    const dy = target.y - this.y
    
    let easedSpeed = speed
    if (easing === 'cubic') {
      easedSpeed = easeOutCubic(speed)
    } else if (easing === 'expo') {
      easedSpeed = easeOutExpo(speed)
    }
    
    this.x += dx * easedSpeed
    this.y += dy * easedSpeed
    
    return this
  }

  moveByAngle(
    angle: number,
    distance: number,
    friction?: number
  ): TooltipPoint {
    const angleRotated = angle + Math.PI / 2
    
    if (friction) {
      const easedDistance = distance * easeOutCubic(1 - friction)
      this.x = this.x + Math.sin(angleRotated) * easedDistance
      this.y = this.y - Math.cos(angleRotated) * easedDistance
    } else {
      this.x = this.x + Math.sin(angleRotated) * distance
      this.y = this.y - Math.cos(angleRotated) * distance
    }
    
    return this
  }

  equalsTo(point: Point): boolean {
    return Math.abs(this.x - point.x) < 0.01 && Math.abs(this.y - point.y) < 0.01
  }

  getDifferenceTo(point: Point): TooltipPoint {
    return new TooltipPoint(this.x - point.x, this.y - point.y)
  }

  getDistanceTo(point: Point): number {
    const diff = this.getDifferenceTo(point)
    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
  }

  getAngleTo(point: Point): number {
    const diff = this.getDifferenceTo(point)
    return Math.atan2(diff.y, diff.x)
  }

  lerp(target: Point, amount: number): TooltipPoint {
    this.x = this.x + (target.x - this.x) * amount
    this.y = this.y + (target.y - this.y) * amount
    return this
  }

  toObject(): Point {
    return {
      x: this.x,
      y: this.y
    }
  }
}