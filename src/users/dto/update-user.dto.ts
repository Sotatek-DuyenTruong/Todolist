
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'
import { Role, RecordStatus } from '@prisma/client'

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	fullName?: string

	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsEnum(Role)
	role?: Role

	@IsOptional()
	@IsEnum(RecordStatus)
	status?: RecordStatus

	@IsOptional()
	@IsString()
	@MinLength(8)
	password?: string
}
