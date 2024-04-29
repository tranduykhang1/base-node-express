import { DefaultService } from '../core/service/default'

/**
 * ServiceDI serves as the dependency injection container for services.
 * It provides methods to create instances of services with their dependencies injected.
 */
class ServiceDI {
  private serviceMap: Map<string, object>

  constructor() {
    this.serviceMap = new Map()
  }

  get defaultService(): DefaultService {
    const serviceKey = DefaultService.name
    if (!this.serviceMap.has(serviceKey)) {
      this.serviceMap.set(serviceKey, new DefaultService())
    }
    return this.serviceMap.get(serviceKey) as DefaultService
  }
}

export const serviceDI = new ServiceDI()
