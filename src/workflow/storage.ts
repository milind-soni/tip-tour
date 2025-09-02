import { Workflow } from './types'

const NS = 'tiptour:workflow:'

export function saveWorkflowLocal(workflow: Workflow): void {
  const key = NS + workflow.id
  localStorage.setItem(key, JSON.stringify(workflow))
}

export function loadWorkflowLocal(id: string): Workflow | null {
  const key = NS + id
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) as Workflow : null
}

export function listWorkflowsLocal(): string[] {
  const ids: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    if (key.startsWith(NS)) ids.push(key.slice(NS.length))
  }
  return ids
}

export function downloadWorkflow(workflow: Workflow, filename?: string): void {
  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${workflow.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function readWorkflowFile(file: File): Promise<Workflow> {
  const text = await file.text()
  return JSON.parse(text) as Workflow
}


