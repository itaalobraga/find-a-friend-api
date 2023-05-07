import { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { register } from "./register";

export async function organizationsRoutes(app: FastifyInstance) {
  app.post("/organizations", register);

  app.post("/login", authenticate);
}
