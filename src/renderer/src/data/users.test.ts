import { atom } from 'nanostores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Y from 'yjs'
import { useUsers } from './user'

// src/renderer/src/data/user.test.ts

// // Mock dependencies
// vi.mock('@syncedstore/core', () => ({
//   syncedStore: vi.fn(() => ({
//     users: {},
//     lists: []
//   })),
//   getYjsDoc: vi.fn()
// }))
// vi.mock('@syncedstore/react', () => ({
//   useSyncedStore: vi.fn((store) => store)
// }))
// vi.mock('nanoid', () => ({
//   nanoid: vi.fn(() => 'abcd')
// }))
// vi.mock('nanostores', () => ({
//   atom: vi.fn(() => ({
//     get: vi.fn(),
//     set: vi.fn()
//   })),
//   onMount: vi.fn()
// }))
// vi.mock('remeda', () => ({
//   values: vi.fn((obj) => Object.values(obj)),
//   isTruthy: vi.fn(
//     (val) => !!val)
// }))
// vi.mock('tiny-invariant', () => ({
//   default: vi.fn((condition, message) => {
//     if (!condition) throw new Error(message)
//   })
// }))

describe('useUsers', () => {
  let store: any
  let $currentUserId: any

  beforeEach(() => {
    store = {
      users: {},
      lists: []
    }
    $currentUserId = atom(null)
    vi.mocked(atom).mockReturnValue($currentUserId)
    vi.mocked(useSyncedStore).mockReturnValue(store)
  })

  it('should initialize with no users', () => {
    const { users } = useUsers()
    expect(users).toEqual([])
  })

  it('should add a new user', () => {
    const { addUser, users } = useUsers()
    addUser('Test User')
    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({
      id: 'user:abcd',
      name: 'Test User',
      avatar: null,
      lists: expect.any(Y.Array)
    })
  })

  it('should switch to a user', () => {
    const { switchToUser, users } = useUsers()
    const user = { id: 'user:abcd', name: 'Test User', avatar: null, lists: new Y.Array() }
    store.users[user.id] = user
    switchToUser(user)
    expect($currentUserId.set).toHaveBeenCalledWith(user.id)
  })
})
