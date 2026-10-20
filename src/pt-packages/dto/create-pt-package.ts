import {
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator'
import { TrainingType } from '@prisma/client'

export class CreatePtPackageDto {
  @IsString()
  @MinLength(2)
  name!: string

  @IsIn([12, 15, 30, 50])
  totalSessions!: number

  @IsEnum(TrainingType)
  trainingType!: TrainingType

  @IsNumber()
  @Min(1)
  validityDays!: number

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number
}