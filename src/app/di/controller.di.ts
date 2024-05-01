import { DefaultController } from '../core/controller/default.controller'

/**
 * ControllerDI serves as the dependency injection container for controllers.
 * It provides methods to create instances of controllers with their dependencies injected.
 */
class ControllerDI {
  // Map to hold controller instances
  private controllerMap: Map<string, object>

  constructor() {
    this.controllerMap = new Map()
  }

  get defaultController(): DefaultController {
    const controllerKey = DefaultController.name
    if (!this.controllerMap.has(controllerKey)) {
      const defaultController = new DefaultController()
      this.controllerMap.set(controllerKey, defaultController)
    }
    return this.controllerMap.get(controllerKey) as DefaultController
  }
}

// Create and export an instance of ControllerDI
export const controllerDI = new ControllerDI()
