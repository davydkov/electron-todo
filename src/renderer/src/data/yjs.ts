import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import type { ListId, UserId } from './_types'
import { entries } from 'remeda'
import { isTest, isCI } from 'std-env'

function enableSyncing(doc: Y.Doc) {
  if (isTest || isCI) {
    return
  }
  new IndexeddbPersistence(doc.guid, doc)
  const provider = new WebsocketProvider(
    import.meta.env.RENDERER_VITE_WS_URL,
    doc.guid,
    doc
  )
  doc.once('destroy', () => {
    provider.destroy()
  })
}

const defaultUserList = [
  {
    id: 'user:1' as UserId,
    name: 'Chris Sporre',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg',
    lists: new Y.Array() as any
  },
  {
    id: 'user:2' as UserId,
    name: 'Katrina Lacarte',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/female/21.jpg',
    lists: new Y.Array() as any
  },
  {
    id: 'user:3' as UserId,
    name: 'Jammie Lindop',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg',
    lists: new Y.Array() as any
  }
]

export function getUserYDoc() {
  const doc = new Y.Doc({
    guid: 'users',
    autoLoad: true,
    shouldLoad: true,
    collectionid: 'user'
  })
  const users = doc.getMap('users')
  defaultUserList.forEach((user) => {
    users.set(user.id, new Y.Map(entries(user)))
  })
  enableSyncing(doc)
  return doc
}

export function getListYDoc(listId: ListId) {
  const doc = new Y.Doc({
    guid: listId,
    shouldLoad: true,
    collectionid: 'todolist'
  })
  enableSyncing(doc)
  return doc
}
