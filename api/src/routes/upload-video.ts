import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import fs from "node:fs";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * 1024 * 25, // 25MB
    },
  });

  app.post("/videos", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "Missing file input." });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      throw new Error("Invalid file type");
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const filePath = path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      fileUploadName
    );

    await pump(data.file, fs.createWriteStream(filePath));

    const video = await prisma.video.create({
        data: {
            name: data.filename,
            path: filePath,
        }
    })

    return {
        video,
    }
  });
}
