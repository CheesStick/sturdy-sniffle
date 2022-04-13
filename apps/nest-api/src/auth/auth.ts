import { Injectable } from "@nestjs/common";
import { ProfileProvider } from "../profile/profile";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthProvider {

  constructor ( 
    private readonly profile: ProfileProvider, 
    private readonly jwtService: JwtService) {}

  async token(id) {

    const [ at, rt ] = await Promise.all([
      this.jwtService.signAsync({ id }, { secret: process.env.JWT_SECRET_KEY, expiresIn: '15m' }),
      this.jwtService.signAsync({ id }, { secret: process.env.JWT_SECRET_KEY, expiresIn: '1d' })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  async compareData(compareVal , compareAgainst) {
    return await bcrypt.compare(compareVal, compareAgainst);
  }

  async hashData(data) {
    return await bcrypt.hash(data, 10);
  }

  async createPasswordResetToken(profile) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    profile.password_reset_token = this.hashData(resetToken);
    profile.password_reset_expires = Date.now() + 10 * 60 * 1000;
    await this.profile.updateProfile(profile, profile.id);
    return resetToken;
  }

}