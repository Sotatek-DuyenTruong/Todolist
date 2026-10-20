import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
	@IsString()
	@MinLength(2)
	fullName: string

	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsEnum(Role)
	role: Role

	@IsOptional()
	@IsString()
	@MinLength(8)
	password?: string
}