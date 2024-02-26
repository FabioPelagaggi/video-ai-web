import { fastify } from "fastify";

const server = fastify();
server.get('/', async (request, reply) => {
    return 'Server is up and running'
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
