import { UnathorizedError } from "@/use-cases/errors/unathorized-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnathorizedError();
  }
}
