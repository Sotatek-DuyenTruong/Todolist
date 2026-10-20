import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'
import { RecordStatus, TrainingType } from '@prisma/client'

export class UpdatePtPackageDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsIn([12, 15, 30, 50])
  totalSessions?: number

  @IsOptional()
  @IsEnum(TrainingType)
  trainingType?: TrainingType

  @IsOptional()
  @IsNumber()
  @Min(1)
  validityDays?: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus
}