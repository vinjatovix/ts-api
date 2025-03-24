import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/types';
import { Uuid } from '../../../shared/domain/valueObject';
import { SceneCircumstance } from '../../Scenes/domain';
import { RelationshipCircumstancePrimitives } from './interfaces';

interface RelationshipCircumstanceProps {
  character: Uuid;
  circumstance: Nullable<SceneCircumstance>;
}

export class RelationshipCircumstance extends AggregateRoot {
  readonly character: Uuid;
  readonly circumstance: Nullable<SceneCircumstance>;

  constructor({ character, circumstance }: RelationshipCircumstanceProps) {
    super();
    this.character = character;
    this.circumstance = circumstance;
  }

  toPrimitives(): { character: string; circumstance?: string } {
    return {
      character: this.character.value,
      ...(this.circumstance ? { circumstance: this.circumstance.value } : {})
    };
  }

  static fromPrimitives({
    character,
    circumstance
  }: RelationshipCircumstancePrimitives) {
    return new RelationshipCircumstance({
      character: new Uuid(character as string),
      circumstance: circumstance ? new SceneCircumstance(circumstance) : null
    });
  }
}
