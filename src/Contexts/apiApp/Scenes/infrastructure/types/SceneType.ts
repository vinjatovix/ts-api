import { Entity } from '../../../../shared/infrastructure/persistence/mongo';
import {
  CharacterType,
  PopulatedCharacterType
} from '../../../Characters/infraestructure/types';

export type SceneType = Entity & {
  description: string;
  characters: string[] | Partial<CharacterType[] | PopulatedCharacterType[]>;
};
