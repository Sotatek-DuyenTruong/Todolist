import { IsEnum } from 'class-validator'
import { ContractStatus } from '@prisma/client'

export class UpdatePtContractDto {
  @IsEnum(ContractStatus)
  status!: ContractStatus
}