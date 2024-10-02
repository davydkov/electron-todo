import type { TodoState } from './_types'

export function isValidStateTransition(from: TodoState, to: TodoState): boolean {
  if (from === to) return true

  switch (from) {
    case 'TODO':
      return to === 'ONGOING'
    case 'ONGOING':
      return to == 'TODO' || to === 'DONE'
    case 'DONE':
      return to === 'ONGOING'
  }
}
