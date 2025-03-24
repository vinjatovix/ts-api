import { CharacterPrimitives } from '../../../Characters/domain/interfaces';

export interface RelationshipCircumstancePrimitives {
  character: string | CharacterPrimitives;
  circumstance?: string;
}
