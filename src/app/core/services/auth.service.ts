import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { REDIS_KEY, REDIS_TTL } from '../../../common/enums/redis.enum'
import { BaseHttpError } from '../../../common/base/base.error'
import { LoginResponse } from '../../../common/responses/auth.response'
import { Nullable, Optional } from '../../../common/types/common.type'
import envConfig from '../../../config/env.config'
import { Password } from '../../../utils/password.util'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { User } from '../entities/user.entity'
import { redisServices } from './redis.service'
import { userServices } from './user.service'
import { mailService } from './mail.service'

class AuthServices {
  signToken(payload: Partial<User>, expiresIn: string, secret = envConfig.get('atSecret')): string {
    const token = jwt.sign(payload, secret, {
      expiresIn
    })
    return token
  }

  verifyToken(token: string, secret = envConfig.get('atSecret')): Nullable<Partial<User>> {
    const decodedToken = jwt.verify(token, secret) as Partial<User>
    if (decodedToken?._id) return decodedToken
    return null
  }

  async refreshToken(user: User): Promise<LoginResponse> {
    const [at, rt] = [
      this.signToken({ email: user.email, role: user.role, _id: user._id }, envConfig.get('atExp')),
      this.signToken({ _id: user._id }, envConfig.get('rtExp'), envConfig.get('rtSecret'))
    ]

    redisServices.set<LoginResponse>(REDIS_KEY.auth + user._id, { at, rt }, REDIS_TTL['7d'])
    return {
      at,
      rt
    }
  }

  async login(dto: LoginDto): Promise<Optional<LoginResponse>> {
    const user = await userServices.findOne({ email: dto.email })
    if (!user) {
      throw new BaseHttpError(StatusCodes.BAD_REQUEST, 'wrong credentials!')
    }
    if (!Password.compare(user.password!, user.key!, dto.password)) {
      throw new BaseHttpError(StatusCodes.BAD_REQUEST, 'wrong credentials!')
    }
    const [at, rt] = [
      this.signToken({ email: user.email, role: user.role, _id: user._id }, envConfig.get('atExp')),
      this.signToken({ _id: user._id }, envConfig.get('rtExp'), envConfig.get('rtSecret'))
    ]

    await Promise.all([
      userServices.update({ _id: user._id }, { lastLogin: new Date() }),
      redisServices.set<LoginResponse>(REDIS_KEY.auth + user._id, { at, rt }, REDIS_TTL['7d'])
    ])

    return { at, rt }
  }

  async register(dto: RegisterDto): Promise<Nullable<User>> {
    await userServices.checkDuplicateUser(dto.email)

    const { encryptedData: password, key } = Password.encrypt(dto.password)

    dto = {
      ...dto,
      password,
      key
    }

    const user = await userServices.create(dto)

    await mailService.sendMail({
      html: 'Hello',
      to: user.email,
      subject: 'Demo',
      text: 'Demo'
    })

    return user
  }
}

export const authServices = new AuthServices()
