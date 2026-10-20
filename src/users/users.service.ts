import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly safeSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    status: true,
    createdAt: true,
  } satisfies Prisma.UserSelect

  async create(createUserDto: CreateUserDto) {
    const hasLogin = ([Role.ADMIN, Role.STAFF] as Role[]).includes(createUserDto.role)

    if (hasLogin && (!createUserDto.password || !createUserDto.email)) {
      throw new BadRequestException('Admin and Staff require an email and password.')
    }

    if (!hasLogin && createUserDto.password) {
      throw new BadRequestException('Only Admin and Staff can have a password.')
    }

    try {
      const passwordHash = createUserDto.password ? await bcrypt.hash(createUserDto.password, 10) : undefined

      const user = await this.prisma.user.create({
        data: {
          fullName: createUserDto.fullName,
          email: createUserDto.email,
          phone: createUserDto.phone,
          role: createUserDto.role,
          passwordHash,
        },
        select: this.safeSelect,
      })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists.')
      }
      throw error
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.safeSelect,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeSelect,
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    })

    if (!currentUser) {
      throw new NotFoundException('User not found')
    }

    const nextRole = updateUserDto.role ?? currentUser.role
    const hasLogin = ([Role.ADMIN, Role.STAFF] as Role[]).includes(nextRole)

    if (hasLogin && updateUserDto.password === undefined && !currentUser.role) {
      throw new BadRequestException('Admin and Staff require a password.')
    }

    if (!hasLogin && updateUserDto.password) {
      throw new BadRequestException('Only Admin and Staff can have a password.')
    }

    const passwordHash = updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : undefined

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          fullName: updateUserDto.fullName,
          email: updateUserDto.email,
          phone: updateUserDto.phone,
          role: updateUserDto.role,
          status: updateUserDto.status,
          passwordHash,
        },
        select: this.safeSelect,
      })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists.')
      }
      throw error
    }
  }

  async deactivate(id: string) {
    await this.findOne(id)

    return this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      select: this.safeSelect,
    })
  }
}
