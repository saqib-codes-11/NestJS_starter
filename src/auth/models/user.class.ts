import { Role } from './role.enum';
import { IsEmail, IsString } from 'class-validator';

export class User {
  id?: string;
  @IsString()
  password?: string;
  name?: string;
  phone?: string
  @IsEmail()
  email?: string;
  imagePath?: string;
  role?: Role;
}