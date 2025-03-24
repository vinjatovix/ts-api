import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { SceneMapper } from './SceneMapper';
import { Scene } from '../../domain';
import { SceneRepository } from '../../domain/interfaces';
import { PopulatedScene } from '../../domain/PopulatedScene';
import { PopulatedSceneType } from '../types/PopulatedSceneType';
import { SceneType } from '../types/SceneType';
import { ObjectId } from 'bson';

export class MongoSceneRepository
  extends MongoRepository<Scene>
  implements SceneRepository
{
  protected collectionName(): string {
    return 'scenes';
  }

  public async save(scene: Scene): Promise<void> {
    return this.handleMongoError(() => this.persist(scene.id.value, scene));
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Scene[] | PopulatedScene[]> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const documents = await collection.find<SceneType>({}).toArray();

      return documents.map(SceneMapper.toDomain);
    }
    if (options.include) {
      const { include } = options;
      if (include.some((i) => i.includes('characters'))) {
        options.list = ['characters'];
      }
    }
    const documents = await this.fetch<PopulatedSceneType>({ options });

    return options.include
      ? documents.map(SceneMapper.toPopulatedDomain)
      : documents.map(SceneMapper.toDomain);
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

      return document ? SceneMapper.toDomain(document) : null;
    }
    if (options.include) {
      const { include } = options;
      if (include.some((i) => i.includes('characters'))) {
        options.list = ['characters'];
      }
    }
    const documents = await this.fetch<PopulatedSceneType>({ id, options });

    return documents.length
      ? SceneMapper.toPopulatedDomain(documents[0])
      : null;
  }
}
