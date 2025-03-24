import { MetadataType } from '../../infrastructure/persistence/mongo/types';

export class Metadata {
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt: Date;
  readonly updatedBy: string;

  constructor({ createdAt, createdBy, updatedAt, updatedBy }: MetadataType) {
    createdAt && (this.createdAt = createdAt);
    createdBy && (this.createdBy = createdBy);
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  toPrimitives() {
    return {
      ...(this.createdAt && { createdAt: this.createdAt }),
      ...(this.createdBy && { createdBy: this.createdBy }),
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    };
  }

  static fromPrimitives({
    createdAt,
    createdBy,
    updatedAt,
    updatedBy
  }: MetadataType) {
    return new Metadata({
      createdAt,
      createdBy,
      updatedAt,
      updatedBy
    });
  }
}
