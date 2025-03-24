import { CharacterPrimitives } from '../../../Characters/domain/interfaces';
import { Scene } from '../../domain';
import { PopulatedScene } from '../../domain/PopulatedScene';
import { PopulatedSceneType } from '../types/PopulatedSceneType';
import { SceneType } from '../types/SceneType';

import { BaseMapper } from '../../../shared/infraestructure/persistence/BaseMapper';

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
    return PopulatedScene.fromPrimitives({
      id: document._id,
      description: document.description,
      characters: document.characters.map((character) => {
        const transformedCharacter = BaseMapper.mapNestedId(character);

        return {
          ...transformedCharacter,
          id: transformedCharacter._id
        } as CharacterPrimitives;
      }),
      metadata: document.metadata
    });
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
