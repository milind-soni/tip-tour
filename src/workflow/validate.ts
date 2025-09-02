import { Workflow, ValidationResult } from './types'

export function validateWorkflow(wf: unknown): ValidationResult {
  const errors: string[] = []
  if (!wf || typeof wf !== 'object') return { ok: false, errors: ['Not an object'] }
  const w = wf as Partial<Workflow>
  if (w.version !== '1.0') errors.push('version must be "1.0"')
  if (!w.id) errors.push('id is required')
  if (!Array.isArray(w.steps)) errors.push('steps must be an array')
  else if (w.steps.length === 0) errors.push('steps cannot be empty')
  else {
    w.steps.forEach((s, i) => {
      if (!s || typeof s !== 'object') errors.push(`steps[${i}] must be an object`)
      // minimal type check
      const allowed = ['message','click','input','waitFor','navigate']
      // @ts-ignore
      if (!s.type || !allowed.includes(s.type)) errors.push(`steps[${i}].type invalid`)
      if ((s.type === 'click' || s.type === 'input' || s.type === 'waitFor') && !s.selector) {
        errors.push(`steps[${i}].selector required for type ${s.type}`)
      }
      if (s.type === 'input' && !s.payload?.value) {
        errors.push(`steps[${i}].payload.value required for input`)
      }
      if (s.type === 'navigate' && !s.payload?.url) {
        errors.push(`steps[${i}].payload.url required for navigate`)
      }
    })
  }
  return { ok: errors.length === 0, errors: errors.length ? errors : undefined }
}


