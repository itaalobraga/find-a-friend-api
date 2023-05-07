import { OrganizationsRepository } from "@/repositories/organizations";
import { Organization } from "@prisma/client";
import { hash } from "bcryptjs";
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists-error";

interface CreateOrganizationUseCaseRequest {
  responsibleName: string;
  email: string;
  cep: string;
  address: string;
  phone: string;
  password: string;
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization;
}

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    responsibleName,
    address,
    cep,
    email,
    password,
    phone,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const passwordHash = await hash(password, 6);

    const organizationWithSameEmail = await this.organizationsRepository.findByEmail(
      email
    );

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError();
    }

    const organization = await this.organizationsRepository.create({
      address,
      cep,
      email,
      password: passwordHash,
      phone,
      responsibleName,
    });

    return {
      organization,
    };
  }
}
