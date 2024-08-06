import { StatusCodes } from 'http-status-codes'
import { BaseHttpError } from '../../../common/base/base.error'
import { BaseServices } from '../../../common/base/service.base'
import { User, UserEntity } from '../entities/user.entity'
import { classUtil } from '../../../utils/class.util'

class UserServices extends BaseServices<User> {
  constructor() {
    super(UserEntity)
    classUtil.autoBind(this)
  }

  async checkDuplicateUser(email: string): Promise<void> {
    return this.withSession(async (session) => {
      await this.update({ email }, { lastName: 'Updated' }, session)
      const user = await this.findOne({ email })
      if (user) {
        throw new BaseHttpError(StatusCodes.CONFLICT, 'duplicate email!')
      }
    })
  }
}

export const userServices = new UserServices()
