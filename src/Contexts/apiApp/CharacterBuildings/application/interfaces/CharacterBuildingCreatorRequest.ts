export interface CharacterBuildingCreatorRequest
  extends Record<string, unknown> {
  id: string;
  actor: string;
  character: string;
  scene: string;
  center: string;
  sceneCircumstances: string;
  previousCircumstances: string;
  relationshipCircumstances: {
    character: string;
    circumstance: string;
  }[];
  actionUnits: { action: string; strategies: string[] }[];
}
