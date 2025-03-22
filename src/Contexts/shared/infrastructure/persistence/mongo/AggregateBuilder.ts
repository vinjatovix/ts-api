export type AggregationOptions = {
  include?: string[];
  fields?: string[];
  list?: string[];
  avoidLookup?: string[];
  avoidUnwind?: string[];
  unwind?: string[];
};

type MatchStage = {
  $match: Record<string, unknown>;
};
type LookupStage = {
  $lookup: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
};
type UnwindStage = {
  $unwind: {
    path: string;
    preserveNullAndEmptyArrays: true;
  };
};
type ProjectStage = {
  $project: Record<string, number>;
};
type GroupStage = {
  $group: Record<string, unknown>;
};

type PipelineStage =
  | MatchStage
  | LookupStage
  | UnwindStage
  | ProjectStage
  | GroupStage;

export type AggregatePipeline = PipelineStage[];

export class AggregateBuilder {
  buildPipeline(
    id: string,
    {
      include = [],
      fields = [],
      list = [],
      avoidLookup = [],
      avoidUnwind = []
    }: AggregationOptions
  ): AggregatePipeline {
    const pipeline = [];

    const nonPopulableFields = fields.filter(
      (field) => !include.includes(field)
    );

    if (id) {
      pipeline.push(this.createMatchStage(id));
    }
    if (include.length) {
      const lookupAndUnwindStages = this.createLookupAndUnwindStages({
        include,
        avoidLookup,
        avoidUnwind
      });
      pipeline.push(...lookupAndUnwindStages);
    }
    if (list.length) {
      const groupStage = this.createGroupStage({
        list,
        fields,
        avoidLookup,
        include
      });
      pipeline.push(groupStage);
    }
    if (nonPopulableFields.length) {
      const projectStage = this.createProjectStage(nonPopulableFields, include);
      pipeline.push(projectStage);
    }

    return pipeline;
  }

  private createMatchStage(id: string): MatchStage {
    return { $match: { _id: id } };
  }

  private createLookupAndUnwindStages({
    include,
    avoidLookup,
    avoidUnwind
  }: {
    include: string[];
    avoidLookup: string[];
    avoidUnwind: string[];
  }): Array<LookupStage | UnwindStage> {
    return include.flatMap((path) =>
      this.createStagesForIncludePath(path, avoidLookup, avoidUnwind)
    );
  }

  private createStagesForIncludePath(
    path: string,
    avoidLookup: string[],
    avoidUnwind: string[]
  ): Array<LookupStage | UnwindStage> {
    const pathSegments = path.split('.');
    const stages: Array<LookupStage | UnwindStage> = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const localField = pathSegments.slice(0, i + 1).join('.');
      const from = this.getCollectionName(pathSegments[i]);
      const localFieldAlias = localField;

      if (!avoidLookup.includes(localFieldAlias)) {
        stages.push({
          $lookup: {
            from,
            localField,
            foreignField: '_id',
            as: localFieldAlias
          }
        });
      }
      if (!avoidUnwind.includes(localFieldAlias)) {
        stages.push({
          $unwind: {
            path: `$${localFieldAlias}`,
            preserveNullAndEmptyArrays: true
          }
        });
      }
    }

    return stages;
  }

  private createProjectStage(
    fields: string[],
    include: string[]
  ): ProjectStage {
    let stageValue: Record<string, number> = { _id: 1, metadata: 1 };

    for (const field of fields) {
      stageValue[field] = 1;
    }
    for (const path of include) {
      stageValue = this.addIncludeToProjectStage(stageValue, path);
    }

    return { $project: stageValue };
  }

  private addIncludeToProjectStage(
    stageValue: Record<string, number>,
    path: string
  ): Record<string, number> {
    const newValue = {
      ...stageValue,
      [`${path}._id`]: 1,
      [`${path}.metadata`]: 1
    };

    const pathSegments = path.split('.');
    for (let i = 1; i < pathSegments.length; i++) {
      const parentPath = pathSegments.slice(0, i).join('.');
      newValue[`${parentPath}._id`] = 1;
      newValue[`${parentPath}.metadata`] = 1;
    }

    return newValue;
  }

  private createGroupStage({
    list,
    fields,
    avoidLookup,
    include
  }: {
    list: string[];
    fields: string[];
    avoidLookup: string[];
    include: string[];
  }): GroupStage {
    const baseStage: Record<string, unknown> = {
      _id: '$_id',
      metadata: { $first: '$metadata' }
    };

    const stageWithLists = list.reduce(
      (acc, listField) => this.addListFieldToGroupStage(acc, listField, fields),
      baseStage
    );

    const stageWithAvoidLookup = avoidLookup.reduce(
      (acc, field) =>
        this.addAvoidLookupToGroupStage(acc, field, fields, include),
      stageWithLists
    );

    const finalStage = this.addRemainingFieldsToGroupStage(
      stageWithAvoidLookup,
      fields,
      avoidLookup,
      include
    );

    return { $group: finalStage };
  }

  private addListFieldToGroupStage(
    stageValue: Record<string, unknown>,
    listField: string,
    fields: string[]
  ): Record<string, unknown> {
    const newValue = { ...stageValue };
    const pathSegments = listField.split('.');
    const root = pathSegments[0];
    const otherFields = this.getOtherFieldsForGroup(root, fields, listField);

    if (pathSegments.length === 1) {
      newValue[root] = { $push: `$${root}` };
    } else {
      newValue[root] = { $first: { ...otherFields } };
    }

    return newValue;
  }

  private getOtherFieldsForGroup(
    root: string,
    fields: string[],
    listField: string
  ): Record<string, unknown> {
    const baseFields: Record<string, string> = {
      _id: `$${root}._id`,
      metadata: `$${root}.metadata`
    };

    if (listField.includes('.')) {
      const nestedField = listField.split('.')[1];
      baseFields[nestedField] = `$${listField}`;
    }

    const additionalFields = fields
      .filter((currentField) => currentField.startsWith(`${root}.`))
      .reduce(
        (acc, currentField) => {
          const fieldWithoutRoot = currentField.replace(`${root}.`, '');
          acc[fieldWithoutRoot] = `$${currentField}`;
          return acc;
        },
        {} as Record<string, unknown>
      );

    return { ...baseFields, ...additionalFields };
  }

  private addAvoidLookupToGroupStage(
    stageValue: Record<string, unknown>,
    field: string,
    fields: string[],
    include: string[]
  ): Record<string, unknown> {
    const newValue = { ...stageValue };

    const fieldsToAdd = [
      ...include.filter((f) => f.startsWith(`${field}.`)),
      ...fields.filter((f) => f.startsWith(`${field}.`))
    ];

    if (fieldsToAdd.length) {
      newValue[field] = {
        $push: fieldsToAdd.reduce((acc, cv) => {
          const fieldWithoutPrefix = cv.replace(`${field}.`, '');
          return { ...acc, [fieldWithoutPrefix]: `$${cv}` };
        }, {})
      };
    }

    return newValue;
  }

  private addRemainingFieldsToGroupStage(
    stageValue: Record<string, unknown>,
    fields: string[],
    avoidLookup: string[],
    include: string[]
  ): Record<string, unknown> {
    const newValue = { ...stageValue };
    fields.forEach((field) => {
      const isNotIncluded = !include.some((f) =>
        field.startsWith(`${f.split('.')[0]}.`)
      );
      const isFieldLookupAllowed = !avoidLookup.some((f) =>
        field.startsWith(`${f}.`)
      );
      if (isFieldLookupAllowed && isNotIncluded) {
        newValue[field] = { $first: `$${field}` };
      }
    });

    include.forEach((field) => {
      const root = field.split('.')[0];
      if (!avoidLookup.includes(root) && !newValue[root]) {
        newValue[root] = { $first: `$${root}` };
      }
    });

    return newValue;
  }

  private readonly collectionNameMap = new Map<string, string>([
    ['actor', 'users']
  ]);

  private getCollectionName(field: string): string {
    if (this.collectionNameMap.has(field)) {
      return this.collectionNameMap.get(field)!;
    }

    return field.endsWith('s') ? field : `${field}s`;
  }
}
