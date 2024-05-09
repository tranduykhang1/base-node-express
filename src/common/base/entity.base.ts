import { prop } from '@typegoose/typegoose'

export class BaseEntity {
  _id!: string

  @prop({ require: false, type: Date })
  createdAt!: Date

  @prop({ require: false, type: Date })
  updatedAt!: Date

  @prop({ require: false, type: Date })
  deletedAt!: Date
}
