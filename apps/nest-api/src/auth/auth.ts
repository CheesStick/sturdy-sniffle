import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
import { ProfileProvider } from "../profile/profile";

@Injectable()
export class AuthProvider {

  constructor ( private readonly profile: ProfileProvider ) {}

  async createPasswordResetToken(profile) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    profile.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    profile.password_reset_expires = Date.now() + 10 * 60 * 1000;
    await this.profile.updateProfile(profile, profile.id);
    return resetToken;
  }

}