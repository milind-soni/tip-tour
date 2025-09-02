import { Workflow, Step } from './types'
import { buildSelector } from './selector'

export function createRecorder() {
  let steps: Step[] = []
  let active = false

  function onClick(e: MouseEvent) {
    if (!active) return
    const target = e.target as Element
    if (!target) return
    // Only record button-like interactions for MVP simplicity
    const tag = target.tagName
    const role = target.getAttribute('role')
    if (tag === 'BUTTON' || role === 'button') {
      steps.push({ type: 'click', selector: buildSelector(target) })
    }
  }

  function start() {
    if (active) return
    active = true
    steps = []
    window.addEventListener('click', onClick, true)
  }

  function stop() {
    if (!active) return
    active = false
    window.removeEventListener('click', onClick, true)
  }

  function getWorkflow(id: string, name?: string): Workflow {
    return {
      version: '1.0',
      id,
      name,
      steps
    }
  }

  return { start, stop, getWorkflow }
}


