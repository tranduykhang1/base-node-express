import { faker } from '@faker-js/faker'
import { User } from '../../src/app/core/entities/user.entity'
import { userServices } from '../../src/app/core/services/user.service'
import { BaseHttpError } from '../../src/common/errors/base.error'

describe('UserServices', () => {
  beforeEach(() => {})

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('checkDuplicateByEmail', () => {
    it('should throw error when user is not found', async () => {
      const user = { email: 'existing@example.com', password: 'hashedPassword', key: 'key', _id: 'userId' }

      jest.spyOn(userServices, 'findOne').mockResolvedValueOnce(user as User)

      await expect(userServices.checkDuplicateUser(faker.internet.email())).rejects.toThrow(BaseHttpError)
    })

    it('should return access token and refresh token when login is successful', async () => {
      jest.spyOn(userServices, 'findOne').mockResolvedValueOnce(null)

      const response = await userServices.checkDuplicateUser(faker.internet.email())

      expect(response).toEqual(undefined)
    })
  })
})
