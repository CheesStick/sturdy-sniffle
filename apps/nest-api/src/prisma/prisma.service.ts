import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Profile } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  onModuleInit() {
    this.$use( async (params, next) => {
      if (params.action == 'create' && params.model == 'Profile' || params.action == 'update' && params.args.data.password) {
        const profile: Profile = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        profile.password = bcrypt.hashSync(profile.password, salt);
        params.args.data = profile;
      }
      return next(params);
    } )
  }

}
