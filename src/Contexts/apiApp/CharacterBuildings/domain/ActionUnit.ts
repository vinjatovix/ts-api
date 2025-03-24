import { AggregateRoot } from '../../../shared/domain';
import { StringValueObject } from '../../../shared/domain/valueObject';

interface ActionUnitProps {
  action: StringValueObject;
  strategies: StringValueObject[];
}

export interface ActionUnitPrimitives {
  action: string;
  strategies: string[];
}

export class ActionUnit extends AggregateRoot {
  readonly action: StringValueObject;
  readonly strategies: StringValueObject[];

  constructor({ action, strategies }: ActionUnitProps) {
    super();
    this.action = action;
    this.strategies = strategies;
  }

  toPrimitives() {
    return {
      action: this.action.value,
      strategies: this.strategies.map((s) => s.value)
    };
  }

  static fromPrimitives(primitives: ActionUnitPrimitives): ActionUnit {
    return new ActionUnit({
      action: new StringValueObject(primitives.action),
      strategies: primitives.strategies.map((s) => new StringValueObject(s))
    });
  }
}
