export interface ScenePatcherRequest extends Record<string, unknown> {
  id: string;
  description?: string;
  characters?: string[];
}
