import { OrganizationsRepository } from "@/repositories/organizations";
import { AuthenticateOrganizationUseCase } from "../authenticate-organization";

export function makeAuthenticateOrganizationUseCase() {
  const organizationsRepository = new OrganizationsRepository();
  const useCase = new AuthenticateOrganizationUseCase(organizationsRepository);

  return useCase;
}
