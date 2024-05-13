import { AuthControllers } from '../core/controllers/auth.controller'
import { UserControllers } from '../core/controllers/user.controller'

/**
 * ControllerDI serves as the dependency injection container for controllers.
 * It provides methods to create instances of controllers with their dependencies injected.
 */
class ControllerContainers {
  // Map to hold controller instances
  private controllerMap: Map<string, object>

  constructor() {
    this.controllerMap = new Map()
  }

  get authControllers(): AuthControllers {
    const controllerKey = AuthControllers.name
    if (!this.controllerMap.has(controllerKey)) {
      this.controllerMap.set(controllerKey, new AuthControllers())
    }
    return this.controllerMap.get(controllerKey) as AuthControllers
  }

  get userControllers(): UserControllers {
    const controllerKey = UserControllers.name
    if (!this.controllerMap.has(controllerKey)) {
      this.controllerMap.set(controllerKey, new UserControllers())
    }
    return this.controllerMap.get(controllerKey) as UserControllers
  }
}

// Create and export an instance of ControllerContainer
export const controllerContainers = new ControllerContainers()
