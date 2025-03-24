export class BaseMapper {
  // Mapper genérico para transformar '_id' a 'id'
  static mapId<T extends { _id: string | number }>(document: T): T {
    const { _id, ...rest } = document;
    return { ...rest, id: _id } as unknown as T;
  }

  // General method to handle nested objects and avoid repeating the logic
  static mapNestedId<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends { _id?: string | number } & { [key: string]: any }
  >(document: T): T {
    if (document && typeof document === 'object') {
      if ('_id' in document) {
        if (document._id !== undefined) {
          return this.mapId(
            document as { _id: string | number }
          ) as unknown as T;
        }
      }

      // Recurse for nested objects (if needed)
      Object.keys(document).forEach((key) => {
        if (document[key] && typeof document[key] === 'object') {
          (document as Record<string, unknown>)[key] = this.mapNestedId(
            document[key]
          );
        }
      });
    }

    return document;
  }
}
