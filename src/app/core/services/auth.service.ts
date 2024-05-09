import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { BaseHttpError } from '../../../common/errors/base.error'
import { LoginResponse } from '../../../common/responses/auth.response'
import { Nullable, Optional } from '../../../common/types/common.type'
import { Password } from '../../../utils/password.util'
import { serviceContainers } from '../../containers/service.container'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { User } from '../entities/user.entity'

export class AuthServices {
  private userServices = serviceContainers.userServices

  signToken(payload: Partial<User>): string {
    const token = jwt.sign(payload, 'secret', {
      expiresIn: '60m'
    })
    return token
  }

  verifyToken(token: string): boolean {
    const decodedToken = jwt.verify(token, 'secret')
    if (decodedToken) return true
    return false
  }

  async refreshToken(): Promise<string> {
    return ''
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
    await this.userServices.update({ _id: user._id }, { lastLogin: new Date() })
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
