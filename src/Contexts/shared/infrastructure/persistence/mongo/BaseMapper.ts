import { Entity } from './types';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export class BaseMapper {
  static mapId<T extends Entity>(document: T): T {
    const { _id, ...rest } = document;
    return { id: _id, ...rest } as unknown as T;
  }

  static mapNestedId<T extends Entity>(document: T): T {
    const newDocument = JSON.parse(JSON.stringify(document), (_key, value) =>
      isoDateRegex.test(value) ? new Date(value) : value
    );

    for (const key in newDocument) {
      if (typeof newDocument[key] === 'object') {
        newDocument[key] = this.mapNestedId(newDocument[key]);
      }
    }

    if (
      newDocument &&
      typeof newDocument === 'object' &&
      '_id' in newDocument
    ) {
      return this.mapId(newDocument);
    }

    return newDocument;
  }
}
