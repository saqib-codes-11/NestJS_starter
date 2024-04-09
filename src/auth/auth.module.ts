import { UserEntity } from 'src/auth/models/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from './services/auth.service';
import { UserRepository } from 'src/auth/repository/user.repository';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: { expiresIn: '3600s' }
            })
        }),
        TypeOrmModule.forFeature([UserRepository, UserEntity])
    ],
    providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }