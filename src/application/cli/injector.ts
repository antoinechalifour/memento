/* istanbul ignore file */

import { AwilixContainer } from 'awilix';
import Vorpal from 'vorpal';

interface Constructor<T> {
  new (...args: any): T;
}

export class CliInjector {
  public constructor(private container: AwilixContainer) {}

  public action<T extends {}>(
    ActionController: Constructor<T>,
    method: keyof T
  ) {
    const container = this.container;

    return async function(this: Vorpal.CommandInstance, args: any) {
      const controller = container.build(ActionController, {
        injector: () => ({ logger: this.log.bind(this) }),
      });

      // @ts-ignore
      await controller[method](args);
    };
  }
}
