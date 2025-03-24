import { MongoClient } from 'mongodb';
import {
  AggregationOptions,
  MongoRepository
} from '../../../../shared/infrastructure/persistence/mongo';
import { CharacterBuilding } from '../../domain';
import { CharacterBuildingRepository } from '../../domain/interfaces';
import { CharacterBuildingMapper } from '../CharacterBuildingMapper';
import { CharacterBuildingType } from '../types';
import { PopulatedCharacterBuilding } from '../../domain/PopulatedCharacterBuilding';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { PopulatedCharacterBuildingType } from '../types/PopulatedCharacterBuildingType';

export class MongoCharacterBuildingRepository
  extends MongoRepository<CharacterBuilding>
  implements CharacterBuildingRepository
{
  constructor(
    client: Promise<MongoClient>,
    private readonly mapper: CharacterBuildingMapper
  ) {
    super(client);
    this.mapper = mapper;
  }

  protected collectionName(): string {
    return 'characterBuildings';
  }

  public async save(characterBuilding: CharacterBuilding): Promise<void> {
    return await this.persist(characterBuilding.id.value, characterBuilding);
  }

  async findByQuery(
    query: Partial<{ id: string; scene: string }>
  ): Promise<CharacterBuilding[]> {
    const filter: Record<string, unknown> = {};

    if (query.id) {
      filter['_id'] = query.id;
    }
    if (query.scene) {
      filter['scene'] = query.scene;
    }

    const collection = await this.collection();
    const documents = await collection
      .find<CharacterBuildingType>(filter)
      .toArray();

    return documents.map((doc) => this.mapper.toDomain(doc));
  }

  private processIncludeOptions(options: RequestOptions): AggregationOptions {
    const { include, fields } = options;
    const customizedOptions: AggregationOptions = {
      include,
      fields
    };
    if (options.include?.includes('scene.characters')) {
      customizedOptions.list = ['scene.characters'];
      customizedOptions.avoidUnwind = ['scene.characters'];
    }
    if (options.include?.includes('relationshipCircumstances.character')) {
      customizedOptions.avoidLookup = ['relationshipCircumstances'];
      customizedOptions.unwind = ['relationshipCircumstances'];
    }

    if (options.fields?.includes('relationshipCircumstances')) {
      customizedOptions.fields = customizedOptions.fields?.reduce(
        (acc: string[], field: string) => {
          if (field === 'relationshipCircumstances') {
            acc.push('relationshipCircumstances.character');
            acc.push('relationshipCircumstances.circumstance');
          } else {
            acc.push(field);
          }
          return acc;
        },
        []
      );
    }
    return customizedOptions;
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<CharacterBuilding[] | PopulatedCharacterBuilding[]> {
    if (!options.include) {
      const fields = options.fields?.reduce(
        (acc: Record<string, number>, field: string) => {
          acc[field] = 1;
          return acc;
        },
        { metadata: 1 } as Record<string, number>
      );
      const collection = await this.collection();
      const documents = await collection
        .find<CharacterBuildingType>({}, { projection: fields })
        .toArray();
      return documents.map(this.mapper.toDomain);
    }
    const processedOptions: AggregationOptions =
      this.processIncludeOptions(options);
    const documents = await this.fetch<PopulatedCharacterBuildingType>({
      options: processedOptions
    });

    return processedOptions.include
      ? documents.map((doc) => this.mapper.toPopulatedDomain(doc))
      : documents.map((doc) =>
          this.mapper.toDomain(doc as unknown as CharacterBuildingType)
        );
  }
}
