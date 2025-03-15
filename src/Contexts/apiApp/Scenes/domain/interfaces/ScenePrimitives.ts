import { MetadataType } from '../../../../shared/application/MetadataType';
import { CharacterPrimitives } from '../../../Characters/domain/interfaces';

export interface ScenePrimitives extends Record<string, unknown> {
  id: string;
  description?: string;
  characters?: string[] | CharacterPrimitives[];
  metadata: MetadataType;
}
