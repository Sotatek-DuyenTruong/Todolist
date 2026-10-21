import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { randomBytes } from 'crypto'
import { ContractStatus, Prisma, Role, RecordStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateGymContractDto } from './dto/create-gym-contract.dto'
import { UpdateGymContractDto } from './dto/update-gym-contract.dto'

@Injectable()
export class GymContractsService {
  constructor(private readonly prisma: PrismaService) { }

  private generateContractNumber() {
    return `GYM-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`
  }

  async create(dto: CreateGymContractDto) {
    const [member, membershipPackage] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.memberId } }),
      this.prisma.gymMembershipPackage.findUnique({
        where: { id: dto.packageId },
      }),
    ])

    if (!member || member.role !== Role.MEMBER) {
      throw new BadRequestException('Invalid member')
    }

    if (member.status !== RecordStatus.ACTIVE) {
      throw new BadRequestException('Member is inactive')
    }

    if (!membershipPackage || membershipPackage.status !== RecordStatus.ACTIVE) {
      throw new BadRequestException('Gym membership package is unavailable')
    }

    const startDate = new Date(dto.startDate)

    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date')
    }

    const endDate = new Date(startDate)
    endDate.setUTCMonth(
      endDate.getUTCMonth() + membershipPackage.durationMonths,
    )

    return this.prisma.gymContract.create({
      data: {
        memberId: dto.memberId,
        packageId: dto.packageId,
        contractNumber: this.generateContractNumber(),
        startDate,
        endDate,
        contractPrice: membershipPackage.price,
      },
      include: {
        member: true,
        package: true,
      },
    })
  }

  async findAll() {
    return this.prisma.gymContract.findMany({
      include: {
        member: true,
        package: true,
      },
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const contract = await this.prisma.gymContract.findUnique({
      where: { id },
      include: {
        member: true,
        package: true,
      },
    })

    if (!contract) {
      throw new NotFoundException('Gym contract not found')
    }

    return contract
  }

  async update(id: string, dto: UpdateGymContractDto) {
    const current = await this.findOne(id)

    if (current.status !== ContractStatus.ACTIVE && dto.status === undefined) {
      throw new BadRequestException(
        'Only active contracts can have their dates updated',
      )
    }

    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : current.startDate

    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : current.endDate

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date')
    }

    return this.prisma.gymContract.update({
      where: { id },
      data: {
        startDate: dto.startDate ? startDate : undefined,
        endDate: dto.endDate ? endDate : undefined,
        status: dto.status,
      },
      include: {
        member: true,
        package: true,
      },
    })
  }

  async cancel(id: string) {
    const contract = await this.findOne(id)

    if (contract.status === ContractStatus.CANCELLED) {
      throw new BadRequestException('Contract is already cancelled')
    }

    return this.prisma.gymContract.update({
      where: { id },
      data: { status: ContractStatus.CANCELLED },
    })
  }
}