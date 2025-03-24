import { MetadataType } from '../../../../shared/application/MetadataType';

export interface ScenePrimitives extends Record<string, unknown> {
  id: string;
  description: string | null;
  characters: string[];
  metadata: MetadataType;
}
