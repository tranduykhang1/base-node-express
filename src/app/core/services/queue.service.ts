import { Job, Queue, Worker } from 'bullmq'
import { JOB_NAME, QUEUE_NAME } from '../../../common/enums/queue.enum'
import { AppLogger } from '../../../config/log.config'
import { redisServices } from './redis.service'
import { mailService } from './mail.service'

class QueueService {
  #queue: Queue
  #worker: Worker
  #log = new AppLogger(QueueService.name)

  constructor(queueName: QUEUE_NAME) {
    this.#queue = new Queue(queueName, {
      connection: redisServices.connectOpts
    })
    this.#worker = new Worker(
      queueName,
      async (job: Job) => {
        await this.processJob(job)
      },
      { connection: redisServices.connectOpts }
    )

    this.#worker.on('completed', (job: Job) => {
      this.#log.info(`Job ${job.id}:::${job.name} completed`)
    })

    this.#worker.on('failed', (job?: Job, err?: Error) => {
      this.#log.error(`Job ${job?.id}:::${job?.name} failed: ${err?.message}`)
    })
  }

  async addJob<T>(name: JOB_NAME, data: T, opts?: object) {
    await this.#queue.add(name, data, opts)
  }

  private async processJob(job: Job) {
    switch (job.name) {
      case JOB_NAME.AUTH_SEND_VERIFICATION:
        await mailService.sendMail(job.data)
    }
  }
}

export default QueueService
