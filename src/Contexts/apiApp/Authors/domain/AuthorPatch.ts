import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Uuid } from '../../../shared/domain/value-object/Uuid';

import { AuthorName } from './AuthorName';

export class AuthorPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly name?: AuthorName;

  constructor({ id, name }: { id: Uuid; name?: AuthorName }) {
    super();
    this.id = id;
    name && (this.name = name);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.name?.value && { name: this.name.value })
    };
  }

  static fromPrimitives({ id, name }: { id: string; name?: string }) {
    return new AuthorPatch({
      id: new Uuid(id),
      ...(name && { name: new AuthorName(name.trim()) })
    });
  }
}
