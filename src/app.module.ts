import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { GymPackagesModule } from './gym-packages/gym-packages.module'
import { PtPackagesModule } from './pt-packages/pt-packages.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    GymPackagesModule,
    PtPackagesModule,
  ],
})
export class AppModule {}