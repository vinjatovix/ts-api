import { ActionUnit } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/ActionUnit';
import { StringValueObject } from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';

const ACTION_PRIMITIVE = random.word();
const STRATEGY_PRIMITIVE = random.word();

describe('ActionUnit', () => {
  it('should create a valid action unit', () => {
    const action = new StringValueObject(ACTION_PRIMITIVE);
    const strategies = [new StringValueObject(STRATEGY_PRIMITIVE)];

    const actionUnit = new ActionUnit({ action, strategies });

    expect(actionUnit).toMatchObject({
      action,
      strategies
    });
  });

  it('should create a valid action unit from primitives', () => {
    const actionUnit = ActionUnit.fromPrimitives({
      action: ACTION_PRIMITIVE,
      strategies: [STRATEGY_PRIMITIVE]
    });

    expect(actionUnit).toMatchObject({
      action: new StringValueObject(ACTION_PRIMITIVE),
      strategies: [new StringValueObject(STRATEGY_PRIMITIVE)]
    });
  });

  it('should return the action unit primitives', () => {
    const action = new StringValueObject(ACTION_PRIMITIVE);
    const strategies = [new StringValueObject(STRATEGY_PRIMITIVE)];

    const actionUnit = new ActionUnit({ action, strategies });

    expect(actionUnit.toPrimitives()).toMatchObject({
      action: ACTION_PRIMITIVE,
      strategies: [STRATEGY_PRIMITIVE]
    });
  });
});
