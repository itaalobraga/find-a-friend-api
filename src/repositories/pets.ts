import { prisma } from "@/lib/prisma";
import { Pet, Prisma } from "@prisma/client";

interface IPet {
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

interface IPetsRepository {
  create(data: IPet): Promise<Pet>;
}

export class PetsRepository implements IPetsRepository {
  async create(data: IPet) {
    const pet = await prisma.pet.create({
      data: {
        ...data,
        files: {
          createMany: {
            data: data.files,
          },
        },
      },
      include: {
        files: true,
      },
    });

    return pet;
  }
}
