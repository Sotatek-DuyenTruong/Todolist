import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { GymPackagesService } from './gym-packages.service'
import { CreateGymMemberPackageDto } from './dto/create-gym-package.dto'
import { UpdateGymMemberPackageDto } from './dto/update-gym-package.dto'

@Controller('gym-packages')
export class GymPackagesController {
  constructor(
    private readonly gymMemberPackagesService: GymPackagesService,
  ) { }

  @Post()
  create(@Body() dto: CreateGymMemberPackageDto) {
    return this.gymMemberPackagesService.create(dto)
  }

  @Get()
  findAll() {
    return this.gymMemberPackagesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gymMemberPackagesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGymMemberPackageDto,
  ) {
    return this.gymMemberPackagesService.update(id, dto)
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.gymMemberPackagesService.deactivate(id)
  }
}
