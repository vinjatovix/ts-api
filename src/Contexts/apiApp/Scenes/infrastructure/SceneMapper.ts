import {
  BaseEntityMapper,
  BaseMapper
} from '../../../shared/infrastructure/persistence/mongo';
import { Scene, PopulatedScene } from '../domain';
import { ScenePrimitives } from '../domain/interfaces';
import { SceneType, PopulatedSceneType } from './types';

export class SceneMapper extends BaseEntityMapper<
  Scene,
  PopulatedScene,
  SceneType,
  PopulatedSceneType,
  ScenePrimitives
> {
  toDomain(document: SceneType): Scene {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as ScenePrimitives & { characters: string[] };

    return Scene.fromPrimitives(primitives);
  }

  toPopulatedDomain(document: PopulatedSceneType): PopulatedScene {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as ScenePrimitives;

    return PopulatedScene.fromPrimitives(primitives);
  }

  isPopulatedType(
    document: SceneType | PopulatedSceneType
  ): document is PopulatedSceneType {
    return (
      Array.isArray(document.characters) &&
      typeof document.characters[0] === 'object' &&
      '_id' in document.characters[0]
    );
  }

  isPopulatedPrimitives(
    document: ScenePrimitives
  ): document is ScenePrimitives {
    return (
      Array.isArray(document.characters) &&
      typeof document.characters[0] === 'object' &&
      'id' in document.characters[0]
    );
  }
}
