import { AggregateRoot } from '../../../shared/domain';
import { Uuid } from '../../../shared/domain/valueObject';
import { AuthorPatcherRequest } from '../application/interfaces';
import { AuthorName } from './AuthorName';
import { AuthorPatchProps } from './interfaces';

export class AuthorPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly name: AuthorName;

  constructor({ id, name }: AuthorPatchProps) {
    super();
    this.id = id;
    this.name = name;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value
    };
  }

  static fromPrimitives({ id, name }: AuthorPatcherRequest): AuthorPatch {
    return new AuthorPatch({
      id: new Uuid(id),
      name: new AuthorName(name.trim())
    });
  }
}
