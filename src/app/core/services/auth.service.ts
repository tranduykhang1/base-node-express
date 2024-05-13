import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { REDIS_KEY, REDIS_TTL } from '../../../common/enums/redis.enum'
import { BaseHttpError } from '../../../common/errors/base.error'
import { LoginResponse } from '../../../common/responses/auth.response'
import { Nullable, Optional } from '../../../common/types/common.type'
import envConfig from '../../../config/env.config'
import { Password } from '../../../utils/password.util'
import { serviceContainers } from '../../containers/service.container'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { User } from '../entities/user.entity'
import { RedisServices } from './redis.service'
import { UserServices } from './user.service'

export class AuthServices {
  constructor(
    private userServices: UserServices,
    private redisServices: RedisServices
  ) {}

  signToken(payload: Partial<User>, secret = envConfig.get('pwSecret')): string {
    const token = jwt.sign(payload, secret, {
      expiresIn: '60m'
    })
    return token
  }

  verifyToken(token: string, secret = envConfig.get('pwSecret')): Nullable<Partial<User>> {
    const decodedToken = jwt.verify(token, secret) as Partial<User>
    if (decodedToken?._id) return decodedToken
    return null
  }

  async refreshToken(user: User): Promise<LoginResponse> {
    const [at, rt] = [this.signToken({ email: user.email, _id: user._id }), this.signToken({ _id: user._id })]

    this.redisServices.set<LoginResponse>(REDIS_KEY.auth + user._id, { at, rt }, REDIS_TTL['7d'])
    return {
      at,
      rt
    }
  }

  async login(dto: LoginDto): Promise<Optional<LoginResponse>> {
    const user = await this.userServices.findOne({ email: dto.email })
    if (!user) {
      throw new BaseHttpError(StatusCodes.NOT_FOUND, 'wrong credentials!')
    }
    if (!Password.compare(user.password!, user.key!, dto.password)) {
      throw new BaseHttpError(StatusCodes.NOT_FOUND, 'wrong credentials!')
    }
    const [at, rt] = [this.signToken({ email: user.email, _id: user._id }), this.signToken({ _id: user._id })]

    await Promise.all([
      this.userServices.update({ _id: user._id }, { lastLogin: new Date() }),
      this.redisServices.set<LoginResponse>(REDIS_KEY.auth + user._id, { at, rt }, REDIS_TTL['7d'])
    ])

    return { at, rt }
  }

  async register(dto: RegisterDto): Promise<Nullable<User>> {
    await this.userServices.checkDuplicateUser(dto.email)

    const { encryptedData: password, key } = Password.encrypt(dto.password)

    dto = {
      ...dto,
      password,
      key
    }

    const user = await serviceContainers.userServices.create(dto)

    return user
  }
}
