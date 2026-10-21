import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';

@Controller('check-ins')
export class CheckInsController {
  constructor(
    private readonly checkInsService: CheckInsService,
  ) { }

  @Post()
  create(@Body() dto: CreateCheckInDto) {
    return this.checkInsService.create(dto)
  }

  @Get()
  findAll() {
    return this.checkInsService.findAll()
  }
}
