# electron-todo

An Electron TO-DO Application with React, TypeScript.
For Collaboration utilizes yjs, keeps local changes in IndexedDB and use y-websocket server for synchronization  with others.

**Data**

- [src/renderer/src/data/user.ts](src/renderer/src/data/user.ts)  
  Single shared yjs document, keeps track of users, to-do lists and "sharings"

- [src/renderer/src/data/todos.ts](src/renderer/src/data/todos.ts)  
  Represents each todo list, yjs document with items and their states

**Screens**

- Select Account or Create a new one:
  <img width="1022" alt="SCR-20241002-lqhq" src="https://github.com/user-attachments/assets/b2df42e0-ed86-4414-a70f-85f1a746e0c4">

- Create new list or Join to existing:
  <img width="1012" alt="SCR-20241002-lvxs" src="https://github.com/user-attachments/assets/562b1c46-df31-4dda-8cfd-9e6d7c607500">

- Workspace:
  <img width="1022" alt="SCR-20241002-lrcf" src="https://github.com/user-attachments/assets/c1ee710f-1d37-42b8-ab3f-11efa4b3cd46">


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
