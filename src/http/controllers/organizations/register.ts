import { OrganizationAlreadyExistsError } from "@/use-cases/errors/organization-already-exists-error";
import { makeCreateOrganizationUseCase } from "@/use-cases/factories/make-create-organization-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { body } = request;

  const organizationSchema = z.object({
    responsibleName: z.string().nonempty("Campo obrigatório"),
    email: z.string().email("E-mail inválido"),
    cep: z.string().nonempty("Campo obrigatório"),
    address: z.string().nonempty("Campo obrigatório"),
    phone: z.string().nonempty("Campo obrigatório"),
    password: z.string().nonempty("Campo obrigatório"),
  });

  const organizationData = organizationSchema.parse(body);

  try {
    const createOrganizationUseCase = makeCreateOrganizationUseCase();

    const { organization } = await createOrganizationUseCase.execute(organizationData);

    const { password, ...updatedOrganization } = organization;

    return reply.status(200).send({
      organization: updatedOrganization,
    });
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
