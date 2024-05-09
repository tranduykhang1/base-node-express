import { getModelForClass, prop } from '@typegoose/typegoose'
import { BaseEntity } from '../../../common/base/entity.base'

export class User extends BaseEntity {
  @prop({ require: true })
  firstName!: string

  @prop({ require: true })
  lastName!: string

  @prop({ unique: true, require: true })
  email!: string

  @prop({ require: false, default: '' })
  password?: string

  @prop({ require: false, default: '' })
  key?: string

  @prop({ type: Date, require: false, default: null })
  lastLogin?: Date
}

export const UserEntity = getModelForClass(User, {
  schemaOptions: {
    versionKey: false,
    toJSON: {
      transform: (_, v) => {
        delete v.key
        delete v.password
        return v
      }
    }
  }
})
