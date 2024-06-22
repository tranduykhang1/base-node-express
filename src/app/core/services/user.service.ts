import { StatusCodes } from 'http-status-codes'
import { BaseServices } from '../../../common/base/service.base'
import { BaseHttpError } from '../../../common/errors/base.error'
import { User, UserEntity } from '../entities/user.entity'

export class UserServices extends BaseServices<User> {
  constructor() {
    super(UserEntity)
  }

  async checkDuplicateUser(email: string): Promise<void> {
    const user = await this.findOne({ email })
    if (user) {
      throw new BaseHttpError(StatusCodes.CONFLICT, 'duplicate email!')
    }
  }
}
