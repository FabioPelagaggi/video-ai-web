import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";

const server = fastify();

server.register(getAllPromptsRoute);

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
