import { Module } from '@nestjs/common';
import { GymPackagesService } from './gym-packages.service';
import { GymPackagesController } from './gym-packages.controller';

@Module({
  providers: [GymPackagesService],
  controllers: [GymPackagesController],
  exports: [GymPackagesService],
})
export class GymPackagesModule {}
