import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfileProvider {

  constructor( private readonly prisma: PrismaService ) {}

  path = '/home/mohamed/Documents/projects/webdev/blog/apps/nest-backend/src/assets/img/profiles'

  async createProfile(data) {
    return await this.prisma.profile.create({ data });
  }

  async findProfileByID(id) {
    return await this.prisma.profile.findUnique({
      where: { id: await id }
    })
  }

  async findProfileByEmail(email) {
    return await this.prisma.profile.findUnique({
      where: { email }
    })
  }

  async findProfileByResetToken(password_reset_token) {
    return await this.prisma.profile.findFirst({
      where: { password_reset_token }
    })
  }

  async updateProfile(data, profileID) {
    return await this.prisma.profile.update({
      where: { id: await profileID },
      data: data
    })
  }

}