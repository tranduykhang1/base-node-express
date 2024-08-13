import { StatusCodes } from 'http-status-codes'
import { FilterQuery } from 'mongoose'
import { BaseHttpError } from '../../../common/base/base.error'
import { BaseService } from '../../../common/base/service.base'
import { classUtil } from '../../../utils/class.util'
import { User } from '../entities/user.entity'
import { userRepository } from '../repositories/user.repository'

class UserServices extends BaseService<User> {
  constructor() {
    super(userRepository)
    classUtil.autoBind(this)
  }

  async checkDuplicateUser(email: string): Promise<void> {
    const user = await this.findOne({ email })
    if (user) {
      throw new BaseHttpError(StatusCodes.CONFLICT, 'duplicate email!')
    }
  }

  async findAndCount(
    filter: FilterQuery<User>,
    paginate: { offset: number; limit: number }
  ): Promise<{ items: User[]; total: number }> {
    const { offset, limit } = paginate
    return await userRepository.findAndCount(filter, { offset, limit })
  }
}

export const userServices = new UserServices()
