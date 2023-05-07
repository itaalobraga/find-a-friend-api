import { prisma } from "@/lib/prisma";
import { Organization, Prisma } from "@prisma/client";

interface IOrganizationsRepository {
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
  findByEmail(email: string): Promise<Organization | null>;
}

export class OrganizationsRepository implements IOrganizationsRepository {
  async findByEmail(email: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        email,
      },
    });

    return organization;
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({
      data: data,
    });

    return organization;
  }
}
