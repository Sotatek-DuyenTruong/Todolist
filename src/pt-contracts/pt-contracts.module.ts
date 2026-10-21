import { Module } from '@nestjs/common';
import { PtContractsService } from './pt-contracts.service';
import { PtContractsController } from './pt-contracts.controller';

@Module({
  providers: [PtContractsService],
  controllers: [PtContractsController],
  exports: [PtContractsService],
})
export class PtContractsModule {}
