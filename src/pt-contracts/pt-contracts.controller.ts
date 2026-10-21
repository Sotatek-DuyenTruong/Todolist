import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { PtContractsService } from './pt-contracts.service'
import { CreatePtContractDto } from './dto/create-pt-contract.dto'
import { UpdatePtContractDto } from './dto/update-pt-contract.dto'

@Controller('pt-contracts')
export class PtContractsController {
  constructor(private readonly service: PtContractsService) {}

  @Post()
  create(@Body() dto: CreatePtContractDto) {
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
    @Body() dto: UpdatePtContractDto,
  ) {
    return this.service.update(id, dto)
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancel(id)
  }
}