export interface BookPatcherRequest {
  id: string;
  title?: string;
  author?: string;
  isbn?: string;
  releaseDate?: string;
  pages?: number;
}
