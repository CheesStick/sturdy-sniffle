import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.body.token || req.body.token;
    return jwt.verify( token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) return false;
      return true;
    })
  }
}
