import { map, Observable } from 'rxjs';
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SignInReqDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";
import { DuplicateEmailReqDto } from '../dto/duplicate.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('duplicate')
    userExist(@Body() body: DuplicateEmailReqDto): Observable<boolean> {
        return this.authService.doesUserExist(body)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() body: SignInReqDto): Observable<{ token: string }> {
        return this.authService.login(body).pipe(map((jwt: string) => ({ token: jwt })))
    }
}