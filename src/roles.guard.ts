import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) return true;
        const request = context.switchToHttp().getRequest();
        const user: any = jwt.verify(request.headers.authorization, 'IMSS@2021#Assignment');
        request.user = user;
        return roles.some((role) => user.role.includes(role));
    }
}