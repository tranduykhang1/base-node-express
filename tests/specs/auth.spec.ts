import { StatusCodes } from 'http-status-codes'
import { serviceContainers } from '../../src/app/containers/service.container'
import { LoginDto, RegisterDto } from '../../src/app/core/dto/auth.dto'
import { User } from '../../src/app/core/entities/user.entity'
import { AuthServices } from '../../src/app/core/services/auth.service'
import { BaseHttpError } from '../../src/common/errors/base.error'
import { Password } from '../../src/utils/password.util'

describe('AuthServices', () => {
  let authServices: AuthServices

  beforeEach(() => {
    authServices = serviceContainers.authServices
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should throw error when user is not found', async () => {
      const dto: LoginDto = { email: 'nonexistent@example.com', password: 'password' }
      jest.spyOn(serviceContainers.userServices, 'findOne').mockResolvedValueOnce(null)

      await expect(authServices.login(dto)).rejects.toThrow(BaseHttpError)
      expect(serviceContainers.userServices.findOne).toHaveBeenCalledWith({ email: dto.email })
    })

    it('should throw error when password is incorrect', async () => {
      const user = { email: 'existing@example.com', password: 'hashedPassword', key: 'key', _id: 'userId' }
      const dto: LoginDto = { email: 'existing@example.com', password: 'wrongPassword' }

      jest.spyOn(serviceContainers.userServices, 'findOne').mockResolvedValueOnce(user as User)
      jest.spyOn(serviceContainers.redisServices, 'set').mockResolvedValueOnce()

      jest.spyOn(Password, 'compare').mockReturnValueOnce(false)

      await expect(authServices.login(dto)).rejects.toThrow(BaseHttpError)

      expect(Password.compare).toHaveBeenCalledWith(user.password, user.key, dto.password)
    })

    it('should return access token and refresh token when login is successful', async () => {
      const user = { email: 'existing@example.com', password: 'hashedPassword', key: 'key', _id: 'userId' }
      const dto: LoginDto = { email: 'existing@example.com', password: 'correctPassword' }
      const accessToken = 'access_token'
      const refreshToken = 'refresh_token'

      jest.spyOn(serviceContainers.userServices, 'findOne').mockResolvedValueOnce(user as User)
      jest.spyOn(serviceContainers.userServices, 'update').mockResolvedValueOnce(user as User)
      jest.spyOn(serviceContainers.redisServices, 'set').mockResolvedValueOnce()
      jest.spyOn(Password, 'compare').mockReturnValueOnce(true)
      jest.spyOn(authServices, 'signToken').mockReturnValueOnce(accessToken)
      jest.spyOn(authServices, 'signToken').mockReturnValueOnce(refreshToken)

      const response = await serviceContainers.authServices.login(dto)

      // Assertions
      expect(response).toEqual({ at: accessToken, rt: refreshToken })
      expect(serviceContainers.userServices.update).toHaveBeenCalledWith(
        { _id: user._id },
        { lastLogin: expect.any(Date) }
      )
    })
  })

  describe('register', () => {
    it('should throw error when email is already registered', async () => {
      const dto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password',
        lastName: '',
        firstName: ''
      }

      jest
        .spyOn(serviceContainers.userServices, 'checkDuplicateUser')
        .mockRejectedValueOnce(new BaseHttpError(StatusCodes.CONFLICT, 'Email already exists'))

      await expect(authServices.register(dto)).rejects.toThrow(BaseHttpError)
      expect(serviceContainers.userServices.checkDuplicateUser).toHaveBeenCalledWith(dto.email)
    })

    it('should create a new user when registration is successful', async () => {
      const dto: RegisterDto = {
        email: 'new@example.com',
        password: 'password',
        lastName: '',
        firstName: ''
      }
      const newUser = { email: dto.email, _id: 'userId' }

      jest.spyOn(serviceContainers.userServices, 'checkDuplicateUser').mockResolvedValueOnce(undefined)
      jest.spyOn(Password, 'encrypt').mockReturnValueOnce({ encryptedData: 'hashedPassword', key: 'key' })
      jest.spyOn(serviceContainers.userServices, 'create').mockResolvedValueOnce(newUser as User)

      const result = await authServices.register(dto)
      expect(result).toEqual(newUser)
    })
  })
})
