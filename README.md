# electron-todo

An Electron TO-DO Application with React, TypeScript.
For Collaboration utilizes yjs, keeps local changes in IndexedDB and use y-websocket server for synchronization  with others.

**Data**

- [src/renderer/src/data/user.ts](src/renderer/src/data/user.ts)
  Single shared yjs document, keeps track of users, to-do lists and "sharings"

- [src/renderer/src/data/todos.ts](src/renderer/src/data/todos.ts)
  Represents each todo list, yjs document with items and their states

**Screens**

- Select Account or Create a new one
- Create new list or Join to existing
- Todo Workspace




> [!NOTE]
> It is possible to start mutlitple instances from terminal via
> ```
> $ pnpm start
> ```
> Instances 2,3 ... will fail with local synchriozation due to locks on IndexedDB
> but synchronization works with server
>
> 


## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
# Electron app
$ pnpm dev

# Server
$ pnpm start:server
```
