import { useStore } from '@nanostores/react'
import syncedStore from '@syncedstore/core'
import { useSyncedStore } from '@syncedstore/react'
import { nanoid } from 'nanoid'
import { atom } from 'nanostores'
import { isTruthy, values } from 'remeda'
import invariant from 'tiny-invariant'
import * as Y from 'yjs'
import type { ListId, User, UserId } from './_types'
import { getUserYDoc } from './yjs'

const usersYDoc = getUserYDoc()
const syncedStoreUsers = syncedStore(
  {
    users: {} as Record<string, User>,
    lists: [] as Array<{ id: ListId, name: string }>
  },
  usersYDoc
)

const $currentUserId = atom(null as UserId | null)

export function useCurrentUserId() {
  const userId = useStore($currentUserId)
  return [
    userId,
    /* logout */() => {
      $currentUserId.set(null)
    }
  ] as const
}

/**
 * Not reactive, used on mutations
 */
export function currentUserId() {
  const id = $currentUserId.get()
  invariant(id, 'No current user')
  return id
}

export function useUsers() {
  const store = useSyncedStore(syncedStoreUsers)

  const users = values(store.users).filter(isTruthy)

  const switchToUser = (user: User) => {
    $currentUserId.set(user.id)
  }

  const addUser = (name: string) => {
    invariant(isTruthy(name), 'Name is required')
    const newUser = {
      id: 'user:' + nanoid(4) as UserId,
      name,
      avatar: null,
      lists: new Y.Array() as any
    } satisfies User
    syncedStoreUsers.users[newUser.id] = newUser
    switchToUser(newUser)
  }

  return {
    users,
    addUser,
    switchToUser
  }
}

export function useAllLists() {
  const store = useSyncedStore(syncedStoreUsers)
  return store.lists
}

/**
 * @param userId defaults to current user
 */
export function useUser(userId = currentUserId()) {
  return useSyncedStore(syncedStoreUsers).users[userId]!
}
