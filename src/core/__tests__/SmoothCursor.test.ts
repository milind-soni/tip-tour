import { describe, expect, it } from 'vitest'
import { SmoothCursor } from '../SmoothCursor'

describe('SmoothCursor', () => {
  it('moves proportionally when pointer travels outside the smoothing radius', () => {
    const cursor = new SmoothCursor({ radius: 30, friction: 0.92 })
    cursor.update({ x: 100, y: 0 })

    const position = cursor.getSmoothPosition()
    expect(position.x).toBeGreaterThan(5)
    expect(position.x).toBeLessThan(6)
    expect(position.y).toBeCloseTo(0, 5)
    expect(cursor.getDistance()).toBeGreaterThan(0)
  })

  it('supports immediate updates bypassing smoothing', () => {
    const cursor = new SmoothCursor({ enabled: true, radius: 30 })
    cursor.update({ x: 40, y: -20 }, { immediate: true })

    expect(cursor.getSmoothPosition()).toEqual({ x: 40, y: -20 })
    expect(cursor.hasMoved()).toBe(true)
    expect(cursor.getDistance()).toBe(0)
  })

  it('resets pointer and smooth position to a provided point', () => {
    const cursor = new SmoothCursor()
    cursor.update({ x: 120, y: 80 })

    cursor.reset({ x: 10, y: 10 })

    expect(cursor.getPointerPosition()).toEqual({ x: 10, y: 10 })
    expect(cursor.getSmoothPosition()).toEqual({ x: 10, y: 10 })
    expect(cursor.hasMoved()).toBe(false)
  })
})
