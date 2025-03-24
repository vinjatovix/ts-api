import {
  Center,
  CenterType
} from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { random } from '../../../fixtures/shared';

describe('Center', () => {
  test.each(Object.values(CenterType))(
    'should create a valid center: %s',
    (value) => {
      const center = new Center(value);
      expect(center).toMatchObject({ value });
    }
  );

  test.each(['', random.word(), random.integer(), random.boolean(), [], {}])(
    'should throw an error when the value is not valid: %s',
    (value) => {
      expect(() => new Center(value as string)).toThrow({
        name: 'InvalidArgumentError',
        message: `<Center> does not allow the value <${value}>`
      });
    }
  );
});
