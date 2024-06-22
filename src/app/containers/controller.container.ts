import { AuthControllers } from '../core/controllers/auth.controller'
import { UserControllers } from '../core/controllers/user.controller'

/**
 * ControllerDI serves as the dependency injection container for controllers.
 * It provides methods to create instances of controllers with their dependencies injected.
 */
class ControllerContainers {
  // Map to hold controller instances
  private controllerMap = new Map<string, object>()

  get authControllers(): AuthControllers {
    return this.getControllerInstance(AuthControllers)
  }

  get userControllers(): UserControllers {
    return this.getControllerInstance(UserControllers)
  }

  private getControllerInstance<T extends object>(controllerClass: new () => T): T {
    const controllerKey = controllerClass.name
    if (!this.controllerMap.has(controllerKey)) {
      this.controllerMap.set(controllerKey, new controllerClass())
    }
    return this.controllerMap.get(controllerKey) as T
  }
}

export const controllerContainers = new ControllerContainers()
