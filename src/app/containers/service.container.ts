import { AuthServices } from '../core/services/auth.service'
import { UserServices } from '../core/services/user.service'

/**
 * ServiceDI serves as the dependency injection container for services.
 * It provides methods to create instances of services with their dependencies injected.
 */
class ServiceContainers {
  private serviceMap: Map<string, object>

  constructor() {
    this.serviceMap = new Map()
  }

  get authServices(): AuthServices {
    const serviceKey = AuthServices.name
    if (!this.serviceMap.has(serviceKey)) {
      this.serviceMap.set(serviceKey, new AuthServices())
    }
    return this.serviceMap.get(serviceKey) as AuthServices
  }

  get userServices(): UserServices {
    const serviceKey = UserServices.name
    if (!this.serviceMap.has(serviceKey)) {
      this.serviceMap.set(serviceKey, new UserServices())
    }
    return this.serviceMap.get(serviceKey) as UserServices
  }
}

export const serviceContainers = new ServiceContainers()
