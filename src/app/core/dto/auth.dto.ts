import { IsEmail, IsJWT, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  lastName!: string

  @IsString()
  firstName!: string

  @IsString()
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password!: string

  key?: string
}

export class LoginDto {
  @IsString()
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class RefreshTokenDto {
  @IsJWT()
  token!: string
}