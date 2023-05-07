import { OrganizationsRepository } from "@/repositories/organizations";
import { CreateOrganizationUseCase } from "../create-organization";

export function makeCreateOrganizationUseCase() {
  const organizationsRepository = new OrganizationsRepository();
  const useCase = new CreateOrganizationUseCase(organizationsRepository);

  return useCase;
}
