import { prop } from '@typegoose/typegoose'
import { nanoid } from 'nanoid'

export class BaseEntity {
  @prop({ type: String, default: nanoid() })
  _id!: string

  @prop({ require: false, type: Date })
  createdAt!: Date

  @prop({ require: false, type: Date })
  updatedAt!: Date

  @prop({ require: false, type: Date })
  deletedAt!: Date
}
