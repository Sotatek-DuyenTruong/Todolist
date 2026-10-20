import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { PtPackagesService } from './pt-packages.service';
import { CreatePtPackageDto } from './dto/create-pt-package';
import { UpdatePtPackageDto } from './dto/update-pt-package';

@Controller('pt-packages')
export class PtPackagesController {
  constructor(
    private readonly ptPackagesService: PtPackagesService,
  ) { }

  @Post()
  create(@Body() dto: CreatePtPackageDto) {
    return this.ptPackagesService.create(dto)
  }

  @Get()
  findAll() {
    return this.ptPackagesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ptPackagesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePtPackageDto,
  ) {
    return this.ptPackagesService.update(id, dto)
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.ptPackagesService.deactivate(id)
  }
}
