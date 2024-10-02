import { useStore } from '@nanostores/react'
import { useSyncedStore } from '@syncedstore/react'
import { nanoid } from 'nanoid'
import { atom, computed, onMount } from 'nanostores'
import invariant from 'tiny-invariant'
import { Doc as YDoc, Map as YMap } from 'yjs'
import type { ListId, ToDoId, TodoListWorkspace, TodoState } from './_types'
import { syncedStoreList } from './synced-stores'
import { currentUserId, useAllLists, useUser } from './user'
import { isValidStateTransition } from './validation'
import { getListYDoc } from './yjs'

const $todolist = atom<
  {
    id: ListId
    ydoc: YDoc
  } | null
>(null)

const $todolistId = computed($todolist, (doc) => doc?.id ?? null)

onMount($todolistId, () => {
  const stop = $todolist.listen((doc, old) => {
    // Cleanup old ydoc
    if (old && old.ydoc !== doc?.ydoc) {
      old.ydoc.destroy()
    }
  })
  return () => {
    stop()
    $todolist.get()?.ydoc.destroy()
  }
})

/**
 * Get the current todo list id (what is being viewed)
 * And a function to change it
 */
export function useCurrentListId() {
  const todolistId = useStore($todolistId)
  return [
    todolistId,
    (next: ListId | null) => {
      // const current = $todolist.get()
      if (next === null) {
        // current?.ydoc.destroy()
        $todolist.set(null)
        return
      }
      if (next !== $todolist.get()?.id) {
        // current?.ydoc.destroy()
        $todolist.set({
          id: next,
          ydoc: getListYDoc(next)
        })
      }
    }
  ] as const
}

export function useTodoList() {
  const todolist = useStore($todolist)
  invariant(todolist, 'No todo list')
  const store = useSyncedStore(syncedStoreList(todolist.ydoc))
  return {
    id: todolist.id,
    store: store as TodoListWorkspace
  }
}

export function useAddTodoList() {
  const user = useUser()
  const lists = useAllLists()
  return (name: string) => {
    const id = ('todolist:' + nanoid(5)) as ListId

    const ydoc = getListYDoc(id)
    // Create shared types
    ydoc.getMap('meta')
    ydoc.getMap('todos')
    ydoc.getArray('sharedWith')

    // Set name
    const store = syncedStoreList(ydoc)
    store.meta.name = name
    store.meta.createdAt = Date.now()
    store.meta.createdBy = currentUserId()

    user.lists.push(id)
    lists.push({
      id,
      name
    })

    $todolist.set({ id, ydoc })
  }
}

export function addToDo(title: string) {
  // const doc = $todolistYDoc.get()
  const ydoc = $todolist.get()?.ydoc
  invariant(ydoc, 'No todo list ydoc')
  const id = `todo:` + nanoid(4) as ToDoId
  const todos = ydoc.getMap<YMap<any>>('todos')
  todos.set(
    id,
    new YMap([
      ['id', id],
      ['title', title],
      ['state', 'TODO'],
      ['createdAt', Date.now()],
      ['createdBy', currentUserId()]
    ])
  )
}

export function changeTodoState(todoId: ToDoId, state: TodoState) {
  const ydoc = $todolist.get()?.ydoc
  invariant(ydoc, 'No todo list ydoc')
  const store = syncedStoreList(ydoc)
  const todo = store.todos[todoId]
  invariant(todo, 'No todo with id ' + todoId)
  invariant(isValidStateTransition(todo.state, state), 'Invalid state transition')

  ydoc.transact(() => {
    todo.state = state
    todo.lastModified = {
      timestamp: Date.now(),
      userId: currentUserId()
    }
  })
}

export function useJoinToList() {
  const user = useUser()
  const lists = useAllLists()
  return (listId: ListId) => {
    if (user.lists.includes(listId)) {
      alert('You are already in this list')
      return
    }
    if (!lists.find((l) => l.id === listId)) {
      alert('List not found')
      return
    }

    const ydoc = getListYDoc(listId)
    // Create shared types
    ydoc.getMap('meta')
    ydoc.getMap('todos')
    ydoc.getArray('sharedWith')

    // Set name
    const store = syncedStoreList(ydoc)
    store.sharedWith.push(user.id)

    user.lists.push(listId)

    $todolist.set({ id: listId, ydoc })
  }
}
