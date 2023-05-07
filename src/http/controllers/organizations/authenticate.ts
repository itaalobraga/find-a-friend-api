import { OrganizationNotFoundError } from "@/use-cases/errors/organization-not-found";
import { makeAuthenticateOrganizationUseCase } from "@/use-cases/factories/make-authenticate-organization-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const { body } = request;

  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const authenticateData = authenticateSchema.parse(body);

  try {
    const authenticateUseCase = makeAuthenticateOrganizationUseCase();

    const { organization } = await authenticateUseCase.execute(authenticateData);

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
        },
      }
    );

    const { password, ...updatedOrganization } = organization;

    return reply.status(200).send({ organization: updatedOrganization, token });
  } catch (error) {
    if (error instanceof OrganizationNotFoundError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
