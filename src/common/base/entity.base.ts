import { modelOptions, prop } from '@typegoose/typegoose'
import { nanoid } from 'nanoid'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class BaseEntity {
  @prop({ type: String, default: nanoid() })
  _id!: string

  @prop({ require: false, type: Date })
  createdAt?: Date

  @prop({ require: false, type: Date })
  updatedAt?: Date

  @prop({ default: null })
  deletedAt?: Date
}
