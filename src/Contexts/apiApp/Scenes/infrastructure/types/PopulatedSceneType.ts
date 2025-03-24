import { CharacterType } from '../../../Characters/infrastructure/types';
import { SceneType } from './SceneType';

export type PopulatedSceneType = SceneType & {
  characters: CharacterType[];
};
