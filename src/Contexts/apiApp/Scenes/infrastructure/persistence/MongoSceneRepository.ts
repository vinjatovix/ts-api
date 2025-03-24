import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Scene } from '../../domain';
import { SceneRepository } from '../../domain/interfaces';

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
}
