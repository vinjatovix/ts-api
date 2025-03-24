import { Uuid } from '../../../../shared/domain/valueObject';
import { Character } from '../Character';
import { PopulatedCharacter } from '../PopulatedCharacter';

export type CharacterInPopulatedVO = Uuid | Character | PopulatedCharacter;
