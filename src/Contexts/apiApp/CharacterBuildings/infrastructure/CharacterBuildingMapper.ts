import {
  BaseEntityMapper,
  BaseMapper
} from '../../../shared/infrastructure/persistence/mongo';
import { CharacterBuilding } from '../domain';
import { CharacterBuildingPrimitives } from '../domain/interfaces';
import { CharacterBuildingType } from './types';

export class CharacterBuildingMapper extends BaseEntityMapper<
  CharacterBuilding,
  CharacterBuilding,
  CharacterBuildingType,
  CharacterBuildingType,
  CharacterBuildingPrimitives
> {
  toPopulatedDomain(_document: CharacterBuildingType): CharacterBuilding {
    throw new Error('Method not implemented.');
  }
  isPopulatedType(
    _document: CharacterBuildingType
  ): _document is CharacterBuildingType {
    throw new Error('Method not implemented.');
  }
  isPopulatedPrimitives(
    _document: CharacterBuildingPrimitives
  ): _document is CharacterBuildingPrimitives {
    throw new Error('Method not implemented.');
  }
  toDomain(document: CharacterBuildingType): CharacterBuilding {
    const primitives = BaseMapper.mapNestedId<CharacterBuildingType>(document);

    return CharacterBuilding.fromPrimitives(
      primitives as unknown as CharacterBuildingPrimitives
    );
  }
}
