
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
  import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
import { Request } from 'express';
import { IUser } from 'src/users/user.interface';  

  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector) {
        super();
      }
      
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);
      }
  
    handleRequest(err, user, info, context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<Request>();
      // You can throw an exception based on either "info" or "err" arguments
      if (err || !user) {
        throw err || new UnauthorizedException("Token ko hop le hoac khong co Barer token ở header");
      }

      // check permission
      const targetMethod = request.method;
      const targetEnpoint = request.route?.path as string;

      const permissions = user?.permissions ?? [];
      let isExist = permissions.find(permission => (
        targetMethod === permission.method &&
        targetEnpoint === permission.apiPath
      ));

      if (targetEnpoint.startsWith("/api/v1/auth")) isExist = true;
      if (!isExist) {
        throw new ForbiddenException("Ban khong co quyen truy cap vao API nay");
      }

      return user;
    }

    
  }
  