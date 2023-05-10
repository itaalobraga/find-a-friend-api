import { FastifyInstance } from "fastify";
import fastifyMulter from "fastify-multer";
import { create } from "./create";

const multer = fastifyMulter();

export async function petsRoutes(app: FastifyInstance) {
  app.post("/pets", { preHandler: multer.array("files", 4) }, create);
}
