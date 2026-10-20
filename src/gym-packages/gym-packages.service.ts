import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymMemberPackageDto } from './dto/create-gym-package.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGymMemberPackageDto } from './dto/update-gym-package.dto';

@Injectable()
export class GymPackagesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateGymMemberPackageDto) {
    return this.prisma.gymMembershipPackage.create({
      data: {
        name: dto.name,
        durationMonths: dto.durationMonths,
        price: dto.price,
        includedActivities: dto.includedActivities ?? [],
      },
    })
  }

  async findAll() {
    return this.prisma.gymMembershipPackage.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const item = await this.prisma.gymMembershipPackage.findUnique({
      where: { id },
    })

    if (!item) {
      throw new NotFoundException('Gym membership package not found')
    }

    return item
  }

  async update(id: string, dto: UpdateGymMemberPackageDto) {
    await this.findOne(id)

    return this.prisma.gymMembershipPackage.update({
      where: { id },
      data: dto,
    })
  }

  async deactivate(id: string) {
    await this.findOne(id)

    return this.prisma.gymMembershipPackage.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }
}
