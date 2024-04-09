import { UserRepository } from '../repository/user.repository';
import { User } from './../models/user.class';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from '../models/user.entity';
import bcrypt from 'bcrypt'
import { DuplicateEmailReqDto } from '../dto/duplicate.dto';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    //비밀번호 해쉬
    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12)) // 12번의 연산을 처리함
    }

    //유저 중복 확인
    doesUserExist(body: DuplicateEmailReqDto): Observable<boolean> {
        const { email } = body
        return from(
            this.userRepository.findOneByEmail(email)
        ).pipe(
            switchMap((user: User) => {
                console.log(!!user)
                console.log(of(!!user))
                return of(!!user)
            })
        )
    }


    //유저 검증
    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOneByEmail(email),
        ).pipe(
            switchMap((user: User) => {
                if (!user) { //만약 유저가 없으면
                    throw new HttpException(
                        { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
                        HttpStatus.FORBIDDEN,
                    );
                } //유저가 존재하면
                return from(bcrypt.compare(password, user.password)).pipe(
                    map((isValidPassword: boolean) => {
                        if (isValidPassword) {
                            delete user.password;
                            return user;
                        }
                    }),
                );
            }),
        );
    }

    // //로그인
    login(user: User): Observable<string> {
        const { email, password } = user
        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {
                if (user) return from(this.jwtService.signAsync({ user })); //create JWT - credentials
            })
        )
    }

    //jwt인증
    getJwtUser(jwt: string): Observable<User | null> {
        return from(this.jwtService.verifyAsync(jwt)).pipe(
            map(({ user }: { user: User }) => { //jwt가 인증이되면 user를 리턴
                return user;
            }),
            catchError(() => {
                return of(null) //jwt 인증이 되지 않으면 null 리턴
            })
        )
    }
}