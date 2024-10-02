# Electron Todo App

An Electron-based TO-DO application built with React and TypeScript. The app leverages **Yjs** for real-time collaboration, with local changes stored in **IndexedDB**, and a **y-websocket** server for synchronization with other users.

## Features

- **Real-Time Collaboration**: Synchronize to-do lists and user data across multiple instances.
- **Offline Support**: Local changes are persisted in IndexedDB.
- **Synchronization**: Server-side synchronization via y-websocket ensures updates are shared between users even when local synchronization fails due to IndexedDB locks.

## Data Structure

- **[src/renderer/src/data/user.ts](src/renderer/src/data/user.ts)**  
  A shared Yjs document that tracks users, their to-do lists, and sharing information between users.

- **[src/renderer/src/data/todos.ts](src/renderer/src/data/todos.ts)**  
  Represents each to-do list as a Yjs document, containing individual items and their states.

## Screenshots

- **Select or Create an Account**:
  ![Account Selection](https://github.com/user-attachments/assets/b2df42e0-ed86-4414-a70f-85f1a746e0c4)

- **Create or Join a To-Do List**:
  ![Create or Join List](https://github.com/user-attachments/assets/562b1c46-df31-4dda-8cfd-9e6d7c607500)

- **Workspace**:
  ![Workspace](https://github.com/user-attachments/assets/c1ee710f-1d37-42b8-ab3f-11efa4b3cd46)


> [!NOTE]
> You can run multiple instances of the app from the terminal with:
> ```bash
> pnpm start
> ```
> While only one instance can access local synchronization due to IndexedDB locks, synchronization with the server will still function across all instances.

## Project Setup

### Installation

To install dependencies, run:

```bash
pnpm install
```

### Development

To start the Electron app and server for development, use:

```bash
# Start the Electron app
pnpm dev

# Start the WebSocket server
pnpm start:server
```
