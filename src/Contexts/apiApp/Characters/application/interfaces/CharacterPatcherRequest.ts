export interface CharacterPatcherRequest extends Record<string, unknown> {
  id: string;
  book?: string;
  name?: string;
}
