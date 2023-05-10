import { env } from "@/env";
import { s3 } from "@/lib/s3";
import { makeCreatePetUseCase } from "@/use-cases/factories/make-create-pet-use-case";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { body, files } = request;

  if (files.length <= 0) {
    return reply.status(400).send({ message: "Você deve enviar ao menos 1 arquivo." });
  }

  const petSchema = z.object({
    name: z.string().nonempty("Campo obrigatório"),
    description: z.string().nonempty("Campo obrigatório"),
    age: z.string().nonempty("Campo obrigatório"),
    size: z.string().nonempty("Campo obrigatório"),
    energyLevel: z.string().nonempty("Campo obrigatório"),
    dependencyLevel: z.string().nonempty("Campo obrigatório"),
    environment: z.string().nonempty("Campo obrigatório"),
    organizationId: z.string().nonempty("Campo obrigatório"),
  });

  const petData = petSchema.parse(body);

  const petFiles: Prisma.PetImageCreateWithoutPetInput[] = [];

  for await (const file of files) {
    const fileKey = randomUUID() + file.originalname;

    await s3.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentDisposition: "inline",
        ContentType: file.mimetype,
      })
    );

    const fileURL = `https://${env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

    const normalizedFile = {
      mimetype: file.mimetype,
      name: fileKey,
      originalName: file.originalname,
      path: fileURL,
      size: String(file.size ?? ""),
      type: file.mimetype,
    };

    petFiles.push(normalizedFile);
  }

  try {
    const createPetUseCase = makeCreatePetUseCase();

    const pet = await createPetUseCase.execute({ ...petData, files: petFiles });

    return reply.status(201).send(pet);
  } catch (error) {
    throw error;
  }
}
