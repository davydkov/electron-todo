import invariant from "tiny-invariant"
import type { ListId } from "./data/_types"
import { useCurrentListId } from "./data/todos"
import { useCurrentUserId } from "./data/user"

/**
 * Fake router
 */
export function useRouter() {
  const [currentUser, logout] = useCurrentUserId()
  const [listId, setListId] = useCurrentListId()

  const screen = !currentUser ? 'select-account' as const : !listId ? 'main' as const : 'todo-list' as const

  return {
    screen,
    goToSelectAccount: () => {
      setListId(null)
      logout()
    },
    goToMainScreen: () => {
      invariant(currentUser, 'No current user')
      setListId(null)
    },
    gotToList: (listId: ListId) => {
      invariant(currentUser, 'No current user')
      setListId(listId)
    }
  }
}
