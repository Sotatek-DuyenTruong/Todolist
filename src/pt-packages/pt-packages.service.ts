import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePtPackageDto } from './dto/update-pt-package';
import { CreatePtPackageDto } from './dto/create-pt-package';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PtPackagesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePtPackageDto) {
    return this.prisma.ptPackage.create({
      data: {
        name: dto.name,
        totalSessions: dto.totalSessions,
        trainingType: dto.trainingType,
        validityDays: dto.validityDays,
        price: dto.price,
      },
    })
  }

  async findAll() {
    return this.prisma.ptPackage.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const item = await this.prisma.ptPackage.findUnique({
      where: { id },
    })

    if (!item) {
      throw new NotFoundException('PT package not found')
    }

    return item
  }

  async update(id: string, dto: UpdatePtPackageDto) {
    await this.findOne(id)

    return this.prisma.ptPackage.update({
      where: { id },
      data: dto,
    })
  }

  async deactivate(id: string) {
    await this.findOne(id)

    return this.prisma.ptPackage.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }
}
