import { Module } from '@nestjs/common';
import { PtPackagesService } from './pt-packages.service';
import { PtPackagesController } from './pt-packages.controller';

@Module({
  providers: [PtPackagesService],
  controllers: [PtPackagesController],
  exports: [PtPackagesService],
})
export class PtPackagesModule {}
