export type StepType = 'message' | 'click' | 'input' | 'waitFor' | 'navigate'

export interface Selector {
  css?: string
  text?: string
  attr?: Record<string, string>
}

export interface StepUI {
  content?: string
  arrow?: string[]
}

export interface StepPayload {
  value?: string
  url?: string
}

export interface Step {
  id?: string
  type: StepType
  selector?: Selector
  payload?: StepPayload
  ui?: StepUI
  timeout?: number
  mode?: 'guide' | 'auto'
}

export interface Workflow {
  version: '1.0'
  id: string
  name?: string
  metadata?: Record<string, any>
  vars?: Record<string, string>
  steps: Step[]
}

export interface PlayerOptions {
  mode?: 'guide' | 'auto'
  includeInputUI?: boolean
  inputPlaceholder?: string
  onInput?: (value: string) => void
}

export interface ValidationResult {
  ok: boolean
  errors?: string[]
}


