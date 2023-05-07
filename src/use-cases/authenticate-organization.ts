import { OrganizationsRepository } from "@/repositories/organizations";
import { Organization } from "@prisma/client";
import { compare } from "bcryptjs";
import { OrganizationNotFoundError } from "./errors/organization-not-found";

interface AuthenticateOrganizationUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateOrganizationUseCaseResponse {
  organization: Organization;
}

export class AuthenticateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOrganizationUseCaseRequest): Promise<AuthenticateOrganizationUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(email);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const passwordMatch = await compare(password, organization.password);

    if (!passwordMatch) {
      throw new OrganizationNotFoundError();
    }

    return {
      organization,
    };
  }
}
