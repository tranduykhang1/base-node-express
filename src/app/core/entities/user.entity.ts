import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose'
import { BaseEntity } from '../../../common/base/entity.base'
import { USER_ROLE } from '../../../common/enums/user.enum'

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: function (_, ret) {
        delete ret.password
        delete ret.key
        return ret
      }
    }
  }
})
@index({ email: 1 })
export class User extends BaseEntity {
  @prop({ require: true })
  firstName: string

  @prop({ require: true })
  lastName: string

  @prop({ unique: true, require: true })
  email: string

  @prop({ default: USER_ROLE.user })
  role: USER_ROLE

  @prop({ require: false, default: '' })
  password?: string

  @prop({ require: false, default: '' })
  key?: string

  @prop({ type: Date, require: false, default: null })
  lastLogin?: Date
}

export const UserEntity = getModelForClass(User)
