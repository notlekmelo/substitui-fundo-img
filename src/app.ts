import server from './infra/server/server';

server.listen(3000, () => {
  console.log(`[SERVER] Running at http://localhost:3000`);
});