import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { randomBytes } from 'crypto'
import {
  ContractStatus,
  Prisma,
  RecordStatus,
  Role,
  TrainingType,
} from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePtContractDto } from './dto/create-pt-contract.dto'
import { UpdatePtContractDto } from './dto/update-pt-contract.dto'

@Injectable()
export class PtContractsService {
  constructor(private readonly prisma: PrismaService) { }

  private generateContractNumber() {
    return `PT-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`
  }

  private readonly contractInclude = {
    package: true,
    pt: {
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
      },
    },
    members: {
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            role: true,
            status: true,
          },
        },
      },
    },
  } satisfies Prisma.PtContractInclude

  async create(dto: CreatePtContractDto) {
    const memberIds = [...new Set(dto.memberIds)]

    if (memberIds.length !== dto.memberIds.length) {
      throw new BadRequestException('Duplicate member IDs are not allowed')
    }

    const [pt, membershipPackage, members] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.ptId } }),
      this.prisma.ptPackage.findUnique({ where: { id: dto.packageId } }),
      this.prisma.user.findMany({
        where: { id: { in: memberIds } },
      }),
    ])

    if (!pt || pt.role !== Role.PT) {
      throw new BadRequestException('Invalid PT')
    }

    if (pt.status !== RecordStatus.ACTIVE) {
      throw new BadRequestException('PT is inactive')
    }

    if (!membershipPackage || membershipPackage.status !== RecordStatus.ACTIVE) {
      throw new BadRequestException('PT package is unavailable')
    }

    const expectedMemberCount =
      membershipPackage.trainingType === TrainingType.ONE_ON_ONE ? 1 : 2

    if (memberIds.length !== expectedMemberCount) {
      throw new BadRequestException(
        `This package requires exactly ${expectedMemberCount} member(s)`,
      )
    }

    if (members.length !== memberIds.length) {
      throw new BadRequestException('One or more members do not exist')
    }

    if (members.some((member) => member.role !== Role.MEMBER)) {
      throw new BadRequestException('All contract participants must be members')
    }

    if (members.some((member) => member.status !== RecordStatus.ACTIVE)) {
      throw new BadRequestException('All members must be active')
    }

    const startDate = new Date(dto.startDate)

    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date')
    }

    const endDate = new Date(startDate)
    endDate.setUTCDate(endDate.getUTCDate() + membershipPackage.validityDays)

    return this.prisma.ptContract.create({
      data: {
        packageId: dto.packageId,
        ptId: dto.ptId,
        contractNumber: this.generateContractNumber(),
        startDate,
        endDate,
        totalSessions: membershipPackage.totalSessions,
        remainingSessions: membershipPackage.totalSessions,
        members: {
          create: memberIds.map((memberId) => ({ memberId })),
        },
      },
      include: this.contractInclude,
    })
  }

  async findAll() {
    return this.prisma.ptContract.findMany({
      include: this.contractInclude,
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const contract = await this.prisma.ptContract.findUnique({
      where: { id },
      include: this.contractInclude,
    })

    if (!contract) {
      throw new NotFoundException('PT contract not found')
    }

    return contract
  }

  async update(id: string, dto: UpdatePtContractDto) {
    const contract = await this.findOne(id)

    if (contract.status === ContractStatus.CANCELLED) {
      throw new BadRequestException('Cancelled contracts cannot be updated')
    }

    if (
      contract.status === ContractStatus.EXPIRED &&
      dto.status !== ContractStatus.CANCELLED
    ) {
      throw new BadRequestException('Expired contracts cannot be reactivated')
    }

    return this.prisma.ptContract.update({
      where: { id },
      data: { status: dto.status },
      include: this.contractInclude,
    })
  }

  async cancel(id: string) {
    const contract = await this.findOne(id)

    if (contract.status === ContractStatus.CANCELLED) {
      throw new BadRequestException('Contract is already cancelled')
    }

    return this.prisma.ptContract.update({
      where: { id },
      data: { status: ContractStatus.CANCELLED },
      include: this.contractInclude,
    })
  }
}