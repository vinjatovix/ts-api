import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';
import { CharacterPrimitives } from '../../../Characters/domain/interfaces';
import { CharacterType } from '../../../Characters/infrastructure/types';

export interface ScenePrimitives extends Record<string, unknown> {
  id: string;
  description?: string;
  characters?: string[] | CharacterPrimitives[] | CharacterType[];
  metadata: MetadataType;
}
