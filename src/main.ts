import { TipTour } from './core/TipTour'
import { callOpenAI } from './api'

const INITIAL_MESSAGE = 'AI assistant ready – start typing your question!'
const ERROR_MESSAGE = 'Sorry, something went wrong. Please try again.'

function setupButtons(tip: TipTour) {
  const buttonOne = document.getElementById('button-one') as HTMLButtonElement | null
  const buttonTwo = document.getElementById('button-two') as HTMLButtonElement | null
  if (!buttonOne || !buttonTwo) return

  const buttons = [buttonOne, buttonTwo]
  tip.addArrow(buttons)

  const focusTooltip = () => {
    tip.show()
  }

  buttonOne.addEventListener('mouseenter', focusTooltip)
  buttonTwo.addEventListener('mouseenter', focusTooltip)

  buttonOne.addEventListener('click', (event) => {
    tip.setContent('🎯 Nailed it! Now try the second button for more sparkles.')
    tip.addArrow([buttonTwo])
    focusTooltip()
  })

  buttonTwo.addEventListener('click', (event) => {
    tip.setContent('✨ Stellar! Bounce back to the first button to keep the loop going.')
    tip.addArrow([buttonOne])
    focusTooltip()
  })
}

function setupAIInput(tip: TipTour) {
  tip.addInput('Ask TipTour anything…', (value) => {
    tip.setLoading(true)
    Promise.resolve(callOpenAI(value))
      .then((response) => {
        tip.setContent(response)
        tip.show()
      })
      .catch(() => {
        tip.setMessage(ERROR_MESSAGE)
        tip.show()
      })
  })
}

function initDemo() {
  const tip = new TipTour({
    smoothRadius: 18,
    friction: 0.9,
    offset: { x: 24, y: 18 },
    hideDelay: 6000,
    showDelay: 100,
    arrow: { enabled: true, color: '#1a1a1a' }
  })

  tip.setContent(INITIAL_MESSAGE)
  setupAIInput(tip)
  setupButtons(tip)
}

document.addEventListener('DOMContentLoaded', initDemo)
