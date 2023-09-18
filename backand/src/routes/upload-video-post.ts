import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from "../lib/prisma";
import path from "path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import fs from 'node:fs'
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance){
  app.register(fastifyMultipart, {
    limits: {
      fieldSize: 1048576 * 25 //25mb
    }
  })
  app.post('/videos', async (req, reply) => {
    const data = await req.file()

    if(!data){
      return reply.status(400).send({error: 'Missing file input.'})
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3'){
      return reply.status(400).send({error: 'Invalid input type, please upload a MP3.'})
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadNmae = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadNmae)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      },
    })

    return {
      video
    }
  })
}