import { RequestById } from '../../../../../src/Contexts/shared/application/RequestById';
import { Uuid } from '../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../domain/mothers/UuidMother';

export class RequestByIdMother {
  static create(id: Uuid): RequestById {
    return {
      id: id.value
    };
  }

  static random(): RequestById {
    return this.create(UuidMother.random());
  }

  static inexistentId(): RequestById {
    return {
      id: 'not-found'
    };
  }
}
