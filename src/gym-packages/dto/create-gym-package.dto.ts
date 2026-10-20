import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'

export class CreateGymMemberPackageDto {
  @IsString()
  @MinLength(2)
  name!: string

  @IsIn([3, 6, 12])
  durationMonths!: number

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedActivities?: string[]
}