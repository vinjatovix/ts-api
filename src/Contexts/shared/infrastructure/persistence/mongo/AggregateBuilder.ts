import { ObjectId } from 'bson';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Entity } from './Entity';

export class AggregateBuilder<_T extends Entity> {
  public buildPipeline(id: string, options: Partial<RequestOptions>) {
    const pipeline: object[] = [];

    if (id) {
      pipeline.push({ $match: this.getMatchCondition(id) });
    }

    pipeline.push(...this.getPopulateOptions(options.include ?? []));
    pipeline.push(
      ...this.getFieldsProjection(options.fields ?? [], options.include ?? [])
    );

    return pipeline;
  }

  private getMatchCondition(id: string) {
    return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
  }

  private getPopulateOptions(include: string[]) {
    return include.flatMap((includeField) =>
      this.createLookupChain(includeField.split('.'))
    );
  }

  private createLookupChain(pathParts: string[]) {
    const lookups: object[] = [];
    let currentField = pathParts[0];
    let fromCollection = `${currentField}s`;

    pathParts.forEach((_, index) => {
      lookups.push({
        $lookup: {
          from: fromCollection,
          localField: currentField,
          foreignField: '_id',
          as: currentField
        }
      });

      lookups.push({
        $unwind: {
          path: `$${currentField}`,
          preserveNullAndEmptyArrays: true
        }
      });

      if (index < pathParts.length - 1) {
        currentField = `${currentField}.${pathParts[index + 1]}`;
        fromCollection = `${pathParts[index + 1]}s`;
      }
    });

    return lookups;
  }
  private getFieldsProjection(fields: string[], include: string[]) {
    const includedFields = include.map((field) => field.split('.'));

    const adjustedFields = fields.map((field) => {
      const fieldParts = field.split('.');

      const matchingInclude = includedFields.find((inc) => {
        return (
          inc.slice(0, fieldParts.length).join('.') === fieldParts.join('.')
        );
      });

      if (matchingInclude) {
        return matchingInclude.join('.');
      }

      return field;
    });

    const idsToInclude = this.getRelatedCollectionIdsToInclude(include);

    return adjustedFields.length || include.length
      ? [
          {
            $project: {
              ...idsToInclude,
              ...Object.fromEntries(adjustedFields.map((field) => [field, 1]))
            }
          }
        ]
      : [];
  }

  private getRelatedCollectionIdsToInclude(include: string[]) {
    return Object.fromEntries(
      include
        .flatMap((field) => {
          const pathParts = field.split('.');
          return pathParts.length > 1
            ? [
                [field, 1],
                [`${pathParts[0]}._id`, 1],
                [`${pathParts[0]}.metadata`, 1]
              ]
            : [[field, 1]];
        })
        .concat([
          ['_id', 1],
          ['metadata', 1]
        ])
    );
  }
}
