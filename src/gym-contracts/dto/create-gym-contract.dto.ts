import { IsDateString, IsUUID } from 'class-validator'

export class CreateGymContractDto {
  @IsUUID()
  memberId!: string

  @IsUUID()
  packageId!: string

  @IsDateString()
  startDate!: string
}