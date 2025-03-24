import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';
import { CharacterType } from '../../../Characters/infrastructure/types';
import { SceneType } from '../../../Scenes/infrastructure/types';

export type PopulatedCharacterBuildingType = Entity & {
  actor: { _id: string; username: string };
  character: CharacterType;
  scene: SceneType;
  center: string;
  sceneCircumstances: string;
  previousCircumstances: string;
  relationshipCircumstances: {
    character: CharacterType;
    circumstance: string;
  }[];
};
