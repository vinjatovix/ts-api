import { ObjectId } from 'bson';
import { MongoClient } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Username } from '../../../Auth/domain';
import { SceneByQuery } from '../../application/interfaces';
import { Scene, ScenePatch, PopulatedScene } from '../../domain';
import { SceneRepository } from '../../domain/interfaces';
import { SceneMapper } from '../SceneMapper';
import { PopulatedSceneType, SceneType } from '../types/';

export class MongoSceneRepository
  extends MongoRepository<Scene | ScenePatch>
  implements SceneRepository
{
  constructor(
    client: Promise<MongoClient>,
    private readonly mapper: SceneMapper
  ) {
    super(client);
    this.mapper = new SceneMapper();
  }

  protected collectionName(): string {
    return 'scenes';
  }

  public async save(scene: Scene): Promise<void> {
    return await this.persist(scene.id.value, scene);
  }

  private processIncludeOptions(
    options: Partial<RequestOptions>
  ): Partial<RequestOptions> {
    return options.include?.some((i) => i.includes('characters'))
      ? { ...options, list: ['characters'] }
      : options;
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Scene[] | PopulatedScene[]> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const documents = await collection.find<SceneType>({}).toArray();
      return documents.map(this.mapper.toDomain);
    }

    const processedOptions = this.processIncludeOptions(options);
    const documents = await this.fetch<PopulatedSceneType>({
      options: processedOptions
    });

    return processedOptions.include
      ? documents.map(this.mapper.toPopulatedDomain)
      : documents.map(this.mapper.toDomain);
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<Scene | PopulatedScene> | null> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const document = await collection.findOne<SceneType>({
        _id: id as unknown as ObjectId
      });
      return document ? this.mapper.toDomain(document) : null;
    }

    const processedOptions = this.processIncludeOptions(options);
    const documents = await this.fetch<PopulatedSceneType>({
      id,
      options: processedOptions
    });

    return documents.length ? this.mapper.map(documents[0]) : null;
  }

  public async update(scene: ScenePatch, username: Username): Promise<void> {
    return await this.persist(scene.id.value, scene, username);
  }

  public async remove(id: string): Promise<void> {
    return await this.delete(id);
  }

  async findByQuery(query: SceneByQuery): Promise<Scene[]> {
    const filter: { [key: string]: string | { $in: string[] } } = {};

    if (query.characters) {
      filter['characters'] = { $in: query.characters };
    }

    const collection = await this.collection();
    const documents = await collection.find<SceneType>(filter).toArray();

    return documents.map(this.mapper.toDomain);
  }
}
