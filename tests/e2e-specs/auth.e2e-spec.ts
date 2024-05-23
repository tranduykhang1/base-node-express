import { StatusCodes } from 'http-status-codes'
import request, { Response } from 'supertest'
import { mongoSetup } from '../../src/app/db/mongo.db'
import { app, server } from '../../src/index'
import { serviceContainers } from '../../src/app/containers/service.container'

describe('AuthController (e2e) /api/v1', () => {
  const mockUser = {
    email: 'johndoe@example.com',
    password: '123123123',
    firstName: 'John',
    lastName: 'Doe'
  }

  let rt: string

  beforeAll(async () => {})

  afterAll(async () => {
    server.close()
    await serviceContainers.redisServices.clear()
    await mongoSetup.close()
  })

  describe('/auth/register (POST)', () => {
    it('it should register a user', async () => {
      return request(app).post('/api/v1/auth/register').send(mockUser).expect(201)
    })

    it('it should throw the duplicate error', async () => {
      return request(app)
        .post('/api/v1/auth/register')
        .send(mockUser)
        .expect(StatusCodes.CONFLICT)
        .then((response: Response) => {
          expect(response.body.message).toEqual('duplicate email!')
        })
    })
  })

  describe('/auth/login (POST)', () => {
    it('should login with registered account', () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        })
        .expect(StatusCodes.OK)
        .then((response) => {
          rt = response.body.data.rt
          expect(rt).toBeTruthy()
        })
    })

    it('should throw error when wrong credentials', async () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'wrong@email.com',
          password: mockUser.password
        })
        .expect(StatusCodes.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual('wrong credentials!')
        })
    })
  })
})
