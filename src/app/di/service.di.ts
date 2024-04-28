import { DefaultService } from '../core/service/default'

/**
 * This file is a setting up for the DI (DI Container)
 */

class ServiceDI {
  get defaultService() {
    return new DefaultService()
  }
}

export const serviceDI = new ServiceDI()
