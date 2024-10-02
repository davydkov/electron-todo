import { syncedStore } from '@syncedstore/core';
import * as Y from 'yjs';
import type { ListId, TodoListWorkspace, User } from './_types';

const cache = new WeakMap<Y.Doc, any>()

function getOrCreateSyncedStore<T>(doc: Y.Doc, create: () => T): T {
  let cached = cache.get(doc)
  if (!cached) {
    cached = create()
    doc.once('destroy', (d) => {
      cache.delete(d)
    })
    cache.set(doc, cached)
  }
  return cached
}

export function syncedStoreUsers(doc: Y.Doc) {
  return getOrCreateSyncedStore(doc, () => syncedStore({
    users: {} as Record<string, User>,
    lists: [] as ListId[] // All lists
  }, doc))
}

export function syncedStoreList(doc: Y.Doc) {
  return getOrCreateSyncedStore(doc, () => syncedStore({
    meta: {} as TodoListWorkspace['meta'],
    sharedWith: [] as TodoListWorkspace['sharedWith'],
    todos: {} as TodoListWorkspace['todos']
  }, doc))
}
