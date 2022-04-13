import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthProvider } from './auth';
import { EmailModule } from '../email/email.module';
import { AtStrategy, RtStrategy } from './strategies';
import { ProfileModule } from '../profile/profile.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [EmailModule, ProfileModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthProvider, AtStrategy, RtStrategy]
})
export class AuthModule {}
