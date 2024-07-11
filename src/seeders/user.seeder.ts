import { faker } from '@faker-js/faker'
import { User } from '../app/core/entities/user.entity'
import { Seeder } from '../common/interfaces/seeder.interface'
import { Password } from '../utils/password.util'
import { USER_ROLE } from '../common/enums/user.enum'
import { userServices } from '../app/core/services/user.service'

export class UserSeeder implements Seeder {
  async seed(): Promise<void> {
    const items: User[] = []

    for (let i = 0; i < 50; i++) {
      const { encryptedData, key } = Password.encrypt('123123123')
      items.push({
        _id: faker.string.alphanumeric({ length: 21 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: encryptedData,
        key,
        email: `john_doe_${i + 1}@gmail.com`,
        role: i === 0 ? USER_ROLE.admin : USER_ROLE.user
      })
    }
    await userServices.createMany(items)
  }
  async drop(): Promise<void> {
    await userServices.delete({})
  }
}
