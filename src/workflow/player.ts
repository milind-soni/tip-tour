import { TipTour } from '../core/TipTour'
import { Workflow, Step, PlayerOptions } from './types'
import { querySelectorBest } from './selector'

export function createPlayer(workflow: Workflow, options: PlayerOptions = {}) {
  let idx = 0
  const mode = options.mode || 'guide'
  const tip = new TipTour({ arrow: { enabled: true }, hideDelay: 8000 })

  function showStep(step: Step) {
    const content = step.ui?.content || defaultContent(step)
    const targets = step.ui?.arrow || (step.selector?.css ? [step.selector.css] : [])
    tip.setContent(content)
    if (targets.length) tip.addArrow(targets)
    tip.show()
  }

  async function runStep(step: Step) {
    switch (step.type) {
      case 'message':
        showStep(step)
        await waitForUserNext()
        break
      case 'click':
        showStep(step)
        await handleClick(step)
        break
      case 'input':
        showStep(step)
        await handleInput(step)
        break
      case 'waitFor':
        await waitFor(step)
        break
      case 'navigate':
        if (step.payload?.url) window.location.href = step.payload.url
        break
    }
  }

  function waitForUserNext(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  async function handleClick(step: Step) {
    const el = querySelectorBest(step.selector)
    if (!el) return
    if ((step.mode || mode) === 'auto') (el as HTMLElement).click()
    else await waitForUserClick(el)
  }

  function waitForUserClick(el: Element): Promise<void> {
    return new Promise(resolve => {
      const handler = (e: Event) => {
        const anyEvent = e as any
        const composedPathFn = anyEvent && anyEvent.composedPath
        const path: any[] = typeof composedPathFn === 'function' ? composedPathFn.call(anyEvent) : []
        if (e.target === el || (Array.isArray(path) && path.includes(el))) {
          window.removeEventListener('click', handler, true)
          resolve()
        }
      }
      window.addEventListener('click', handler, true)
    })
  }

  async function handleInput(step: Step) {
    const el = querySelectorBest(step.selector) as HTMLInputElement | HTMLTextAreaElement | null
    if (!el) return
    const value = step.payload?.value || ''
    if ((step.mode || mode) === 'auto') {
      el.focus(); el.value = value; el.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
      // guide mode: just wait a bit
      await new Promise(r => setTimeout(r, 500))
    }
  }

  async function waitFor(step: Step) {
    const timeout = step.timeout || 15000
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const el = querySelectorBest(step.selector)
      if (el) return
      await new Promise(r => setTimeout(r, 200))
    }
  }

  function defaultContent(step: Step): string {
    switch (step.type) {
      case 'message': return 'Follow the instructions'
      case 'click': return 'Click the highlighted element'
      case 'input': return 'Enter the required value'
      case 'waitFor': return 'Waiting for the element to appear'
      case 'navigate': return 'Navigating to the page'
    }
  }

  async function play() {
    for (idx = 0; idx < workflow.steps.length; idx++) {
      const step = workflow.steps[idx]
      await runStep(step)
    }
    tip.hide()
  }

  function stop() {
    tip.destroy()
  }

  return { play, stop }
}


