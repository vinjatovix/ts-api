export interface AuthorResponse {
  id: string;
  name: string;
  metadata: {
    createdAt?: Date;
    createdBy?: string;
    updatedAt: Date;
    updatedBy: string;
  };
}
