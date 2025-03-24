import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';
import { User } from '../../../Auth/domain';
import { RelationshipCircumstancePrimitives } from './RelationshipCircumstancePrimitives';
import { CharacterPrimitives } from '../../../Characters/domain/interfaces/CharacterPrimitives';
import { ScenePrimitives } from '../../../Scenes/domain/interfaces';
import { ActionUnitPrimitives } from '../ActionUnit';

export interface CharacterBuildingPrimitives extends Record<string, unknown> {
  id: string;
  actor?: string | Partial<User>;
  character?: string | CharacterPrimitives;
  scene?: string | ScenePrimitives;
  center?: string;
  sceneCircumstances?: string;
  previousCircumstances?: string;
  relationshipCircumstances?: RelationshipCircumstancePrimitives[];
  actionUnits?: ActionUnitPrimitives[];
  metadata: MetadataType;
}
