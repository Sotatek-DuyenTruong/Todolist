import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'
import { RecordStatus } from '@prisma/client'

export class UpdateGymMemberPackageDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsIn([3, 6, 12])
  durationMonths?: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedActivities?: string[]

  @IsOptional()
  status?: RecordStatus
}