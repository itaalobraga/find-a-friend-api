import { FastifyInstance } from "fastify";
import fastifyMulter from "fastify-multer";
import { authenticate } from "./authenticate";
import { register } from "./register";

const upload = fastifyMulter();

export async function organizationsRoutes(app: FastifyInstance) {
  app.post("/organizations", register);

  app.post("/login", authenticate);

  app.post("/test", { preHandler: [upload.single("file")] }, () => null);
}
