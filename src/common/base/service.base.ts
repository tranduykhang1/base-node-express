import { StatusCodes } from 'http-status-codes'
import { FilterQuery, Model, PipelineStage } from 'mongoose'
import envConfig from '../../config/env.config'
import { AppLogger } from '../../config/log.config'
import { SORT_ORDER } from '../enums/pagination.enum'
import { BaseHttpError } from '../errors/base.error'
import { Nullable } from '../types/common.type'

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

  async create(input: Partial<T>, createdBy = ''): Promise<T> {
    try {
      const createInput = { ...input, createdBy }
      const createdData = await this.model.create(createInput)
      return createdData
    } catch (err) {
      throw this.handleServiceError(err, 'Create')
    }
  }

  async findOne(filter: FilterQuery<T>, throwErr = false): Promise<Nullable<T>> {
    try {
      const data = this.model.findOne(filter)
      if (throwErr && !data) {
        throw this.handleServiceError(Error(`${this.model.name} not found`), 'findOne')
      }
      return data
    } catch (error) {
      throw this.handleServiceError(error, 'findOne')
    }
  }

  async update(filter: FilterQuery<T>, input: Partial<Record<keyof T, unknown>>, updatedBy = ''): Promise<Nullable<T>> {
    try {
      const updateInput = { ...input, updatedBy }
      const result = await this.model.findOneAndUpdate(filter, { $set: updateInput }, { new: true })
      if (!result) throw this.handleServiceError(Error(`${this.model.name} not found`), `Update`)
      return result
    } catch (err) {
      throw this.handleServiceError(err, `Update ${this.model.name}`)
    }
  }

  async softDelete(filter: FilterQuery<T>, deletedBy = ''): Promise<void> {
    try {
      const [foundDocument] = await Promise.all([
        this.model.findOne(filter),
        this.model.updateMany(
          filter,
          {
            $set: { deletedAt: new Date(), isDeleted: true, deletedBy }
          },
          { new: true }
        )
      ])
      if (!foundDocument) throw this.handleServiceError(Error(`${this.model.name} not found`), `SoftDelete`)
    } catch (err) {
      this.handleServiceError(err, `SoftDelete ${this.model.name}`)
    }
  }

  async delete(filter: FilterQuery<T>): Promise<Nullable<T>> {
    try {
      return (await this.model.findByIdAndDelete(filter)) ?? null
    } catch (err) {
      throw this.handleServiceError(err, `Delete`)
    }
  }

  async aggregateCount(filter: FilterQuery<T>, pipe: PipelineStage[]): Promise<number> {
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
      sortField: keyof T
      sortOrder: SORT_ORDER
      offset: number
      limit: number
    },
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    pipes: PipelineStage[] | any,
    secondSortField?: SORT_ORDER
  ): Promise<{ items: M[]; total: number }> {
    try {
      const { sortField, sortOrder, offset, limit } = paginate
      const sortOrderNumber = sortOrder === SORT_ORDER.DESC ? -1 : 1
      const secondSort = secondSortField || '_id'

      const [items, total] = await Promise.all([
        this.model.aggregate([
          { $match: filter },
          ...pipes,
          { $sort: { [sortField]: sortOrderNumber, [secondSort]: -1 } },
          { $limit: offset + limit },
          { $skip: offset }
        ]),
        this.aggregateCount(filter, pipes)
      ])

      return { items, total }
    } catch (err) {
      throw this.handleServiceError(err, `Query`)
    }
  }

  private handleServiceError(err: any, operation: string): void {
    this.log.error(`Error occurred during ${operation} operation for ${this.model.name}:`)
    this.log.error(err)
    throw new BaseHttpError(StatusCodes.BAD_REQUEST, err)
  }
}
