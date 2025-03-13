export class AggregateBuilder {
  buildPipeline(
    id: string,
    {
      include = [],
      fields = [],
      list = []
    }: { include?: string[]; fields?: string[]; list?: string[] }
  ): Record<string, unknown>[] {
    const pipeline: Record<string, unknown>[] = [];

    const filteredFields = fields.filter((field) => !include.includes(field));

    if (id) this.addMatchStage(pipeline, id);
    if (include.length) this.addLookupAndUnwind(pipeline, include);
    if (filteredFields.length)
      this.addProjectStage(pipeline, filteredFields, include);
    if (list.length) this.addGroupStages(pipeline, list, filteredFields);

    return pipeline;
  }

  private addMatchStage(pipeline: Record<string, unknown>[], id: string): void {
    pipeline.push({ $match: { _id: id } });
  }

  private addLookupAndUnwind(
    pipeline: Record<string, unknown>[],
    include: string[]
  ): void {
    const includedFields = new Set<string>();

    for (const path of include) {
      const parts = path.split('.');
      let localField = parts[0];
      let from = this.getCollectionName(localField);
      let as = localField;

      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          from = this.getCollectionName(parts[i]);
          localField = parts.slice(0, i + 1).join('.');
          as = localField;
        }

        if (!includedFields.has(as)) {
          pipeline.push({
            $lookup: { from, localField, foreignField: '_id', as }
          });
          pipeline.push({
            $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true }
          });

          includedFields.add(as);
        }
      }
    }
  }

  private addProjectStage(
    pipeline: Record<string, unknown>[],
    fields: string[],
    include: string[]
  ): void {
    const projectStage: Record<string, number> = { _id: 1, metadata: 1 };

    for (const field of fields) {
      projectStage[field] = 1;
    }

    for (const path of include) {
      projectStage[`${path}._id`] = 1;
      projectStage[`${path}.metadata`] = 1;

      const subPaths = path.split('.');
      for (let i = 1; i < subPaths.length; i++) {
        const parentPath = subPaths.slice(0, i).join('.');
        projectStage[`${parentPath}._id`] = 1;
        projectStage[`${parentPath}.metadata`] = 1;
      }
    }

    pipeline.push({ $project: projectStage });
  }

  private addGroupStages(
    pipeline: Record<string, unknown>[],
    list: string[],
    fields: string[]
  ): void {
    for (const listField of list) {
      const groupStage: Record<string, unknown> = {
        _id: '$_id',
        metadata: { $first: '$metadata' },
        [listField]: { $push: `$${listField}` }
      };

      for (const field of fields) {
        if (!field.startsWith(listField)) {
          groupStage[field] = { $first: `$${field}` };
        }
      }

      pipeline.push({ $group: groupStage });
    }
  }

  private getCollectionName(field: string): string {
    return field.endsWith('s') ? field : `${field}s`;
  }
}
