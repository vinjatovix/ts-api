import {
  BaseEntityMapper,
  BaseMapper
} from '../../../shared/infrastructure/persistence/mongo';
import { CharacterBuilding } from '../domain';
import { CharacterBuildingPrimitives } from '../domain/interfaces';
import { PopulatedCharacterBuilding } from '../domain/PopulatedCharacterBuilding';
import { CharacterBuildingType } from './types';
import { PopulatedCharacterBuildingType } from './types/PopulatedCharacterBuildingType';

export class CharacterBuildingMapper extends BaseEntityMapper<
  CharacterBuilding,
  PopulatedCharacterBuilding,
  CharacterBuildingType,
  PopulatedCharacterBuildingType,
  CharacterBuildingPrimitives
> {
  toDomain(document: CharacterBuildingType): CharacterBuilding {
    const primitives = BaseMapper.mapNestedId<CharacterBuildingType>(document);

    return CharacterBuilding.fromPrimitives(
      primitives as unknown as CharacterBuildingPrimitives
    );
  }

  toPopulatedDomain(
    document: PopulatedCharacterBuildingType
  ): PopulatedCharacterBuilding {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as CharacterBuildingPrimitives;

    return PopulatedCharacterBuilding.fromPrimitives(primitives);
  }
  isPopulatedType(
    document: PopulatedCharacterBuildingType
  ): document is PopulatedCharacterBuildingType {
    const isActorPopulated = '_id' in document.actor;
    const isCharacterPopulated = '_id' in document.character;
    const isScenePopulated = '_id' in document.scene;
    const isRelationshipCircumstancesPopulated =
      Array.isArray(document.relationshipCircumstances) &&
      typeof document.relationshipCircumstances[0] === 'object' &&
      '_id' in document.relationshipCircumstances[0].character;

    return (
      isActorPopulated ||
      isCharacterPopulated ||
      isScenePopulated ||
      isRelationshipCircumstancesPopulated
    );
  }

  isPopulatedPrimitives(
    _document: CharacterBuildingPrimitives
  ): _document is CharacterBuildingPrimitives {
    throw new Error('Method not implemented.');
  }
}
