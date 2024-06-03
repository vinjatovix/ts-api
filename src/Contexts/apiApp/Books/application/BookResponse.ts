export interface BookResponse {
  id: string;
  title: string;
  author:
    | string
    | {
        id: string;
        name: string;
      };
  isbn: string;
  releaseDate: Date;
  pages: number;
}
