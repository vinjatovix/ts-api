export abstract class BaseEntityMapper<
  TDomain,
  TPopulatedDomain,
  TType extends object,
  TPopulatedType extends object,
  TPrimitives extends object
> {
  abstract toDomain(document: TType): TDomain;
  abstract toPopulatedDomain(document: TPopulatedType): TPopulatedDomain;
  abstract isPopulatedType(
    document: TType | TPopulatedType
  ): document is TPopulatedType;
  abstract isPopulatedPrimitives(
    document: TPrimitives
  ): document is TPrimitives;

  map(
    entity: TType | TPopulatedType | TPrimitives
  ): TDomain | TPopulatedDomain {
    if (
      this.isPopulatedType(entity as TPopulatedType) ||
      this.isPopulatedPrimitives(entity as TPrimitives)
    ) {
      return this.toPopulatedDomain(entity as TPopulatedType);
    }

    return this.toDomain(entity as TType);
  }
}
