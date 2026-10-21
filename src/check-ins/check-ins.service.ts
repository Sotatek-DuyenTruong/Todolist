import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import {
	ContractStatus,
	Prisma,
	RecordStatus,
	Role,
} from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCheckInDto } from './dto/create-check-in.dto'

@Injectable()
export class CheckInsService {
	constructor(private readonly prisma: PrismaService) { }

	private normalizePhone(phone: string): string {
		return phone.trim().replace(/^\+?886/, '0')
	}

	private getVietnameToday(): Date {
		const date = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Ho_Chi_Minh',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(new Date())

		return new Date(`${date}T00:00:00.000Z`)
	}

	private async validateMemberContract(memberId: string, today: Date) {
		const gymContract = await this.prisma.gymContract.findFirst({
			where: {
				memberId,
				contractType: 'GYM',
				status: ContractStatus.ACTIVE,
				startDate: { lte: today },
				endDate: { gte: today },
			},
			select: { id: true, startDate: true, endDate: true },
		})

		if (gymContract) return

		const ptContract = await this.prisma.ptContract.findFirst({
			where: {
				memberId,
				status: ContractStatus.ACTIVE,
				startDate: { lte: today },
				endDate: { gte: today },
			},
			select: {
				id: true, startDate: true, endDate: true
			}
		})

		if (ptContract) return

		throw new BadRequestException('Member does not have an active contract')
	}

	async create(dto: CreateCheckInDto) {
		const phone = this.normalizePhone(dto.phone)

		const user = await this.prisma.user.findFirst({
			where: { phone },
			select: {
				id: true, fullName: true, role: true, recordStatus: true, contractStatus: true, status: true
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		if (user.status === RecordStatus.INACTIVE) {
			throw new BadRequestException('User is inactive')
		}

		if (!([Role.ADMIN, Role.STAFF] as Role[]).includes(user.role)) {
			throw new BadRequestException('User is not authorized to perform this action')
		}

		const checkInDate = this.getVietnameToday()

		if (user.role === Role.MEMBER) {
			await this.validateMemberContract(user.id, checkInDate)
		}

		const existingCheckIn = await this.prisma.checkIn.findUnique({
			where: {
				userId_checkInDate: {
					userId: user.id,
					checkInDate,
				}
			},
			select: { id: true, checkInAt: true }
		})

		if (existingCheckIn) {
			throw new ConflictException('User has already checked in today')
		}

		try {
			const checkIn = await this.prisma.checkIn.create({
				data: {
					userId: user.id,
					checkInDate,
					createdBy: user.id,
				},
				select: {
					id: true,
					checkedInAt: true,
					checkInDate: true,
					user: {
						select: {
							id: true,
							fullName: true,
							phone: true,
							role: true,
						},
					},
				}
			})

			return {
				message: user.role === Role.MEMBER ? 'Member check-in successful' : 'Staff check-in successful',
				type: user.role === Role.MEMBER ? 'MEMBER' : 'STAFF',
				data: checkIn,
			}
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new ConflictException('User has already checked in today')
			}
			throw error
		}
	}

	async findAll() {
		return this.prisma.checkIn.findMany({
			orderBy: { checkedInAt: 'desc' },
			take: 100,
			select: {
				id: true,
				checkedInAt: true,
				checkInDate: true,
				user: {
					select: {
						id: true,
						fullName: true,
						phone: true,
						role: true,
					},
				},
			},
		})
	}

}
