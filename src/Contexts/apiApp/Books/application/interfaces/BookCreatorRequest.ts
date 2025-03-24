export interface BookCreatorRequest extends Record<string, unknown> {
  id: string;
  title: string;
  author: string;
  isbn: string;
  releaseDate: string;
  pages: number;
}
