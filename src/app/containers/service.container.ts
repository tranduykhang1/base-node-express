import { AuthServices } from '../core/services/auth.service'
import { RedisServices } from '../core/services/redis.service'
import { UserServices } from '../core/services/user.service'

/**
 * ServiceDI serves as the dependency injection container for services.
 * It provides methods to create instances of services with their dependencies injected.
 */
class ServiceContainers {
  private readonly serviceMap: Map<string, object> = new Map()

  get authServices(): AuthServices {
    return this.getService(AuthServices, () => new AuthServices(this.userServices, this.redisServices))
  }

  get userServices(): UserServices {
    return this.getService(UserServices)
  }

  get redisServices(): RedisServices {
    return this.getService(RedisServices)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getService<T extends new (...args: any[]) => object>(
    serviceClass: T,
    factory?: (service: T) => object
  ): InstanceType<T> {
    const serviceKey = serviceClass.name
    if (!this.serviceMap.has(serviceKey)) {
      this.serviceMap.set(serviceKey, factory ? factory(serviceClass) : new serviceClass())
    }
    return this.serviceMap.get(serviceKey) as InstanceType<T>
  }
}

export const serviceContainers = new ServiceContainers()
