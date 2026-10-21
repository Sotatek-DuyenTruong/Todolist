import { IsDateString, IsEnum, IsOptional } from 'class-validator'
import { ContractStatus } from '@prisma/client'

export class UpdateGymContractDto {
  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus
}