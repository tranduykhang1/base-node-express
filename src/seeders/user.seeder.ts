import { faker } from '@faker-js/faker'
import { User } from '../app/core/entities/user.entity'
import { Seeder } from '../common/interfaces/seeder.interface'
import { serviceContainers } from '../app/containers/service.container'
import { Password } from '../utils/password.util'

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
        email: `john_doe_${i + 1}@gmail.com`
      })
    }
    await serviceContainers.userServices.createMany(items)
  }
  async drop(): Promise<void> {
    await serviceContainers.userServices.delete({})
  }
}
