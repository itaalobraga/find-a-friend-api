import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import fastifyMulter, { MulterError } from "fastify-multer";
import { ZodError } from "zod";
import { env } from "./env";
import { organizationsRoutes } from "./http/controllers/organizations/routes";
import { petsRoutes } from "./http/controllers/pets/routes";
import { UnathorizedError } from "./use-cases/errors/unathorized-error";

export const app = fastify();

app.register(fastifyCors);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "1d",
  },
});

app.register(fastifyMulter.contentParser);

app.register(organizationsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (error instanceof UnathorizedError) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof MulterError) {
    return reply.status(401).send({ message: error.message });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error." });
});
