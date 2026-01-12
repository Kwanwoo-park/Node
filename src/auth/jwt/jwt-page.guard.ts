import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtPageGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context: ExecutionContext, status) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        if (!user) {
            if (req.accepts('html')) {
                res.redirect('/login');
                throw new UnauthorizedException();
            }
        }

        return user;
    }
}