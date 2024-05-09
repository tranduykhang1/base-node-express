import { AuthControllers } from '../core/controllers/auth.controller'

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
      const authControllers = new AuthControllers()
      this.controllerMap.set(controllerKey, authControllers)
    }
    return this.controllerMap.get(controllerKey) as AuthControllers
  }
}

// Create and export an instance of ControllerContainer
export const controllerContainers = new ControllerContainers()
