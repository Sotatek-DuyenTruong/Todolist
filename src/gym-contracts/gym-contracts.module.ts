import { Module } from '@nestjs/common';
import { GymContractsService } from './gym-contracts.service';
import { GymContractsController } from './gym-contracts.controller';

@Module({
  providers: [GymContractsService],
  controllers: [GymContractsController],
  exports: [GymContractsService],
})
export class GymContractsModule { }
