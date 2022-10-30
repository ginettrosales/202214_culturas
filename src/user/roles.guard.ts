import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Role } from "./entities/role.enum";
import { UserService } from "./user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService:JwtService, private reflector: Reflector, private usersService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }
    const contex=context.switchToHttp().getRequest();
    const header = contex.headers;
    if(header.authorization == undefined){
      return false;
    }
    const token = header.authorization.replace('Bearer ','');
    const tokenDec = this.jwtService.decode(token)
    const user = await this.usersService.findById(tokenDec.sub);
    return requireRoles.some((role) => user.roles.includes(role));
  }
}