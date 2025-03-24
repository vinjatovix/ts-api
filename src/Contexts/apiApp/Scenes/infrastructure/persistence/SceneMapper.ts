import { BaseMapper } from '../../../shared/infraestructure/persistence/BaseMapper';
import { Scene } from '../../domain';
import { ScenePrimitives } from '../../domain/interfaces';
import { PopulatedScene } from '../../domain/PopulatedScene';
import { PopulatedSceneType } from '../types/PopulatedSceneType';
import { SceneType } from '../types/SceneType';

export class SceneMapper {
  static toDomain(document: SceneType): Scene {
    return Scene.fromPrimitives({
      id: document._id,
      description: document.description,
      characters: document.characters as string[],
      metadata: document.metadata
    });
  }

  static toPopulatedDomain(document: PopulatedSceneType): PopulatedScene {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as ScenePrimitives;
    return PopulatedScene.fromPrimitives(primitives);
  }

  static map(scene: SceneType | PopulatedSceneType): Scene | PopulatedScene {
    if (this.isPopulated(scene)) {
      return this.toPopulatedDomain(scene);
    }

    return this.toDomain(scene);
  }

  static isPopulated(
    document: SceneType | PopulatedSceneType
  ): document is PopulatedSceneType {
    return (
      typeof document.characters[0] === 'object' &&
      '_id' in document.characters[0]
    );
  }
}
