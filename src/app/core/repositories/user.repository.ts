import { BaseRepository } from '../../../common/base/repository.base'
import { User, UserEntity } from '../entities/user.entity'

export class UserRepository extends BaseRepository<User> {}

export const userRepository = new UserRepository(UserEntity)
