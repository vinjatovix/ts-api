import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';

export type CharacterBuildingType = Entity & {
  actor: string;
  character: string;
  scene: string;
  center: string;
  sceneCircumstances: string;
  previousCircumstances: string;
  relationshipCircumstances: { character: string; circumstance: string }[];
};
