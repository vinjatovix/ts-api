export interface SceneCreatorRequest extends Record<string, unknown> {
  id: string;
  description: string;
  characters: string[];
}
