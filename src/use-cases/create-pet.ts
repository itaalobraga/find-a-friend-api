import { PetsRepository } from "@/repositories/pets";
import { Pet, Prisma } from "@prisma/client";

interface CreatePetUseCaseRequest {
  name: string;
  description: string;
  age: string;
  size: string;
  energyLevel: string;
  dependencyLevel: string;
  environment: string;
  organizationId: string;
  files: Prisma.PetImageCreateWithoutPetInput[];
}

interface CreatePetUseCaseResponse {
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(private petRepository: PetsRepository) {}

  async execute({
    name,
    age,
    dependencyLevel,
    description,
    energyLevel,
    environment,
    files,
    organizationId,
    size,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petRepository.create({
      age,
      dependencyLevel,
      description,
      energyLevel,
      environment,
      name,
      size,
      files,
      organizationId,
    });

    return {
      pet,
    };
  }
}
