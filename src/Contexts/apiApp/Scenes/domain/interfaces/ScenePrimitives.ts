import { MetadataType } from '../../../../shared/application/MetadataType';
import { CharacterPrimitives } from '../../../Characters/domain/interfaces';
import { CharacterType } from '../../../Characters/infraestructure/types';

export interface ScenePrimitives extends Record<string, unknown> {
  id: string;
  description?: string;
  characters?: string[] | CharacterPrimitives[] | CharacterType[];
  metadata: MetadataType;
}
