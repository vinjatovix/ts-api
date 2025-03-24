import { createError } from '../../../shared/domain/errors';
import { StringValueObject } from '../../../shared/domain/valueObject';

export enum CenterType {
  Mental = 'mental',
  Emotional = 'emotional',
  Instinctive = 'instinctive'
}

export class Center extends StringValueObject {
  constructor(value: string) {
    super(value);
    Center.ensureIsValidValue(value);
  }

  static create(value: string): Center {
    return new Center(value);
  }

  static ensureIsValidValue(value: string): void {
    if (!Object.values(CenterType).includes(value as CenterType)) {
      throw createError.invalidArgument(
        `<Center> does not allow the value <${value}>`
      );
    }
  }
}
