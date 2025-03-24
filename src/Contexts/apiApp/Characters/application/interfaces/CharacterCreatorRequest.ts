export interface CharacterCreatorRequest extends Record<string, unknown> {
  id: string;
  name: string;
  book: string;
}
