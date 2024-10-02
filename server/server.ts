// Copied from https://github.com/yjs/yjs-demos/blob/main/demo-server/demo-server.js

import * as WebSocket from 'ws';
import { createServer } from 'node:http';
// @ts-ignore - y-websocket is not typed
import { setupWSConnection, docs } from 'y-websocket/bin/utils';

const production = process.env.PRODUCTION != null;
const port = process.env.PORT || 3000;

const server = createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      response: 'ok'
    }));
    return;
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  conn.on('error', console.error);
  console.log('incoming connection');
  setupWSConnection(conn, req, { gc: true });
});

// log some stats
setInterval(() => {
  let conns = 0;
  docs.forEach(doc => { conns += doc.conns.size });
  const stats = {
    conns,
    docs: docs.size,
  };
  console.log(stats);
}, 10000);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
