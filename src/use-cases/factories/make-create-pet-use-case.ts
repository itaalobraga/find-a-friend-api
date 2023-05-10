import { PetsRepository } from "@/repositories/pets";
import { CreatePetUseCase } from "../create-pet";

export function makeCreatePetUseCase() {
  const petRepository = new PetsRepository();

  const useCase = new CreatePetUseCase(petRepository);

  return useCase;
}
