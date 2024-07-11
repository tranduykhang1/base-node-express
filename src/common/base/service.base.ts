import { mongoose } from '@typegoose/typegoose'
import { StatusCodes } from 'http-status-codes'
import { FilterQuery, Model } from 'mongoose'
import { mongoSetup } from '../../app/db/mongo.db'
import envConfig from '../../config/env.config'
import { AppLogger } from '../../config/log.config'
import { SORT_BY, SORT_ORDER } from '../enums/pagination.enum'
import { Nullable } from '../types/common.type'
import { BaseHttpError } from './base.error'

export class BaseServices<T> {
  model: Model<T>
  log: AppLogger = new AppLogger(BaseServices.name)

  constructor(model: Model<T>) {
    if (envConfig.get('nodeEnv') !== 'test') {
      this.model = model
    }

    //replace for the test model
    this.model = model
  }

  async create(input: Partial<T>, session?: mongoose.ClientSession, createdBy = ''): Promise<T> {
    try {
      const createInput = { ...input, createdBy }
      const createdData = await this.model.create([createInput], { session })
      return createdData[0]
    } catch (err) {
      throw this.handleServiceError(err, 'Create')
    }
  }

  async createMany(input: Partial<T[]>, session?: mongoose.ClientSession, createdBy = ''): Promise<void> {
    try {
      const createInput = input.map((i) => {
        return {
          ...i,
          createdBy
        }
      })
      await this.model.insertMany(createInput, { session })
      return
    } catch (err) {
      throw this.handleServiceError(err, 'Create many')
    }
  }

  async findOne(filter: FilterQuery<T>, throwErr = false): Promise<Nullable<T>> {
    try {
      const data = await this.model.findOne(filter)
      if (throwErr && !data) {
        throw this.handleServiceError(Error(`${this.model.name} not found`), 'findOne')
      }
      return data
    } catch (error) {
      throw this.handleServiceError(error, 'findOne')
    }
  }

  async update(
    filter: FilterQuery<T>,
    input: Partial<Record<keyof T, unknown>>,
    session?: mongoose.ClientSession,
    strictMode = false,
    updatedBy = ''
  ): Promise<Nullable<T>> {
    try {
      const updateInput = { ...input, updatedBy }
      const result = await this.model.findOneAndUpdate(filter, { $set: updateInput }, { new: true, session })
      if (strictMode) {
        if (!result) throw this.handleServiceError(Error(`${this.model.name} not found`), `Update`)
      }
      return result
    } catch (err) {
      throw this.handleServiceError(err, `Update ${this.model.name}`)
    }
  }

  async softDelete(filter: FilterQuery<T>, deletedBy = '', session?: mongoose.ClientSession): Promise<void> {
    try {
      const [foundDocument] = await Promise.all([
        this.model.findOne(filter),
        this.model.updateMany(
          filter,
          {
            $set: { deletedAt: new Date(), isDeleted: true, deletedBy }
          },
          { new: true, session }
        )
      ])
      if (!foundDocument) throw this.handleServiceError(Error(`${this.model.name} not found`), `SoftDelete`)
    } catch (err) {
      this.handleServiceError(err, `SoftDelete ${this.model.name}`)
    }
  }

  async delete(filter: FilterQuery<T>, session?: mongoose.ClientSession): Promise<void> {
    try {
      await this.model.deleteMany(filter, { session })
      return
    } catch (err) {
      throw this.handleServiceError(err, `Delete`)
    }
  }

  async aggregateCount(filter: FilterQuery<T>, pipe = []): Promise<number> {
    try {
      const result = await this.model.aggregate([{ $match: filter }, ...pipe, { $count: 'count' }])
      return result.length > 0 ? result[0].count : 0
    } catch (err) {
      throw this.handleServiceError(err, 'AggregateCount')
    }
  }

  async findAndCount<M = T>(
    filter: FilterQuery<T>,
    paginate: {
      sortField?: keyof T
      sortOrder?: SORT_ORDER
      offset: number
      limit: 10
    },
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    pipes = [] as any,
    secondSortField?: SORT_ORDER
  ): Promise<{ items: M[]; total: number }> {
    try {
      const { sortField = SORT_BY.createdAt, sortOrder = SORT_ORDER.DESC, offset = 0, limit = 10 } = paginate
      const sortOrderNumber = sortOrder === SORT_ORDER.DESC ? -1 : 1
      const secondSort = secondSortField || '_id'

      const [items, total] = await Promise.all([
        this.model.aggregate([
          { $match: filter },
          ...pipes,
          { $sort: { [sortField]: sortOrderNumber, [secondSort]: -1 } },
          { $limit: offset + limit },
          { $skip: offset },
          {
            $project: {
              password: 0,
              key: 0
            }
          }
        ]),
        this.aggregateCount(filter, pipes)
      ])

      return { total, items }
    } catch (err) {
      throw this.handleServiceError(err, `Query`)
    }
  }

  private handleServiceError(err: any, operation: string): void {
    this.log.error(`Error occurred during ${operation} operation for ${this.model.name}:`)
    this.log.error(err)
    throw new BaseHttpError(StatusCodes.BAD_REQUEST, err)
  }

  async withSession<T = void>(fn: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoSetup.startSession()
    try {
      await session.startTransaction()
      const result = await fn(session)
      await session.commitTransaction()
      return result
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }
}
