import httpContext from 'express-http-context2'
import { User } from '../../app/core/entities/user.entity'
import { Optional } from '../types/common.type'

export const getAuthenticatedUser = (): Optional<User> => {
  return httpContext.get('user')
}
