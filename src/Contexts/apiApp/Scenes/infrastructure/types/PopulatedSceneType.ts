import { CharacterType } from '../../../Characters/infraestructure/types';
import { SceneType } from './SceneType';

export type PopulatedSceneType = SceneType & {
  characters: CharacterType[];
};
