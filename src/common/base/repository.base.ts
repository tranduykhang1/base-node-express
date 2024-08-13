/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Model, PipelineStage } from 'mongoose'
import { SORT_BY, SORT_ORDER } from '../enums/pagination.enum'
import { Nullable } from '../types/common.type'

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(input: FilterQuery<T>): Promise<T> {
    return await this.model.create(input)
  }

  async createMany(input: FilterQuery<T>[]): Promise<void> {
    await this.model.insertMany(input)
    return
  }

  async findOne(filter: FilterQuery<T>, populates: { path: string; select?: string }[] = []): Promise<Nullable<T>> {
    const result = await this.model.findOne(filter).populate(populates)

    return (result as T) ?? null
  }

  async findLastOne(
    filter: FilterQuery<T> = {},
    populates: { path: string; select?: string }[] = []
  ): Promise<Nullable<T>> {
    const result = await this.model.find(filter).sort({ $natural: 1 }).limit(1).populate(populates)

    return result.length > 0 ? result[0] : null
  }

  async update(filter: FilterQuery<T>, input: Partial<Record<keyof T, unknown>>): Promise<Nullable<T>> {
    const result = await this.model.findOneAndUpdate(filter, { $set: input }, { new: true })
    return result
  }

  async updateMany(filter: FilterQuery<T>, input: Record<string, any>): Promise<any> {
    return await this.model.updateMany(filter, { $set: input }, { new: true })
  }

  async delete(filter: Record<keyof T, any> | any): Promise<void> {
    await this.model.deleteMany(filter)
    return
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments({ ...filter })
  }

  async countAggregate(filter: FilterQuery<T>, pipe: PipelineStage[]): Promise<number> {
    const result = await this.model.aggregate([{ $match: filter }, ...pipe, { $count: 'count' }])
    return result.length > 0 ? result[0].count : 0
  }

  async findAndCount<M = T>(
    filter: FilterQuery<T>,
    paginate: {
      sortBy?: SORT_BY
      sortOrder?: SORT_ORDER
      offset: number
      limit: number
    },
    pipes = [],
    secondSortField?: SORT_BY
  ): Promise<{ items: M[]; total: number }> {
    const { sortBy, sortOrder, offset, limit } = paginate
    const sortOrderNumber = (sortOrder === SORT_ORDER.DESC ? -1 : 1) || 1
    const secondSort = secondSortField || '_id'

    const [items, total] = await Promise.all([
      this.model.aggregate([
        { $match: filter },
        ...pipes,
        { $sort: { [sortBy || SORT_BY.updatedAt]: sortOrderNumber, [secondSort]: -1 } },
        { $limit: offset + limit },
        { $skip: offset }
      ]),
      this.countAggregate(filter, pipes)
    ])

    return { items, total }
  }
}
