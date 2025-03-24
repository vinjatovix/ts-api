import { Entity } from '../../../../shared/infrastructure/persistence/mongo';

export class BaseMapper {
  static mapId<T extends Entity>(document: T): T {
    const { _id, ...rest } = document;
    return { ...rest, id: _id } as unknown as T;
  }

  static mapNestedId<T extends Entity>(document: T): T {
    let newDocument = JSON.parse(JSON.stringify(document));
    if ('_id' in newDocument) {
      newDocument = this.mapId(newDocument);
    }

    for (const key in newDocument) {
      if (key === 'metadata') {
        continue;
      }
      const value = newDocument[key];

      if (Array.isArray(value)) {
        newDocument[key] = value.map((item) => this.mapNestedId(item));
      } else if (value && typeof value === 'object') {
        newDocument[key] = this.mapNestedId(value);
      }
    }

    return newDocument;
  }
}
