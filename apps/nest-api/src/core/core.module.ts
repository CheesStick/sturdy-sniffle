import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from '../email/email.module';
import { LoggerMiddleware } from './logger.middleware';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, ProfileModule, PrismaModule, ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10
  }), EmailModule]
})

export class CoreModule {

  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV == 'development') consumer.apply(LoggerMiddleware).forRoutes('*');
  }

}
