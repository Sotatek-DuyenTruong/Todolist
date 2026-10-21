import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { GymPackagesModule } from './gym-packages/gym-packages.module'
import { PtPackagesModule } from './pt-packages/pt-packages.module'
import { GymContractsModule } from './gym-contracts/gym-contracts.module';
import { PtContractsModule } from './pt-contracts/pt-contracts.module';
import { CheckInsModule } from './check-ins/check-ins.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    GymPackagesModule,
    PtPackagesModule,
    GymContractsModule,
    PtContractsModule,
    CheckInsModule,
  ],
})
export class AppModule {}