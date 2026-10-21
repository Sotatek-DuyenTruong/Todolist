import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsUUID } from 'class-validator'

export class CreatePtContractDto {
  @IsUUID()
  packageId!: string

  @IsUUID()
  ptId!: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsUUID('all', { each: true })
  memberIds!: string[]

  @IsDateString()
  startDate!: string
}