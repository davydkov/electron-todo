import type { Tagged } from "type-fest"

export type UserId = Tagged<string, 'UserId'>
export type ListId = Tagged<string, 'TodoList'>
export type ToDoId = Tagged<string, 'ToDoId'>

export interface User {
  id: UserId
  name: string
  avatar: string | null
  // Available Todo Lists
  lists: ListId[]
}

//
export interface TodoListWorkspace {
  readonly meta: {
    name: string
    createdAt: number // timestamp
    createdBy: UserId
  }
  readonly todos: Record<ToDoId, Todo>
  readonly sharedWith: UserId[]
}

export type TodoState = 'TODO' | 'ONGOING' | 'DONE'

export interface ChangeAction {
  timestamp: number
  userId: UserId
}

export interface Todo {
  id: ToDoId
  title: string
  state: TodoState

  createdAt: number
  createdBy: UserId

  lastModified?: ChangeAction
}
