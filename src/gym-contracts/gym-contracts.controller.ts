import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { GymContractsService } from './gym-contracts.service'
import { CreateGymContractDto } from './dto/create-gym-contract.dto'
import { UpdateGymContractDto } from './dto/update-gym-contract.dto'

@Controller('gym-contracts')
export class GymContractsController {
  constructor(private readonly service: GymContractsService) { }

  @Post()
  create(@Body() dto: CreateGymContractDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGymContractDto,
  ) {
    return this.service.update(id, dto)
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancel(id)
  }
}