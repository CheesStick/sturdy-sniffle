import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthProvider } from './auth';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ProfileModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthProvider]
})
export class AuthModule {}
