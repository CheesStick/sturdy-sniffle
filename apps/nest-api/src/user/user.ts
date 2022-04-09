import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserProvider {

  constructor( private readonly prisma: PrismaService ) {}

  async createUser(data) {
    return await this.prisma.user.create({ data });
  }

  async findUserByID(id) {
    return await this.prisma.user.findUnique({
      where: { id: await id }
    })
  }

  async findUserByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async updateUser(data, userID) {
    return await this.prisma.user.update({
      where: { id: await userID },
      data: data
    })
  }

}