import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';
import {
  CharacterType,
  PopulatedCharacterType
} from '../../../Characters/infrastructure/types';

export type SceneType = Entity & {
  description: string;
  characters: string[] | Partial<CharacterType[] | PopulatedCharacterType[]>;
};
