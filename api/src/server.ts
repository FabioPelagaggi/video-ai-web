import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
});

server.register(getAllPromptsRoute);
server.register(uploadVideoRoute);
server.register(createTranscriptionRoute);
server.register(generateAICompletionRoute);

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
