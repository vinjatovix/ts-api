import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { PopulatedScene } from '../PopulatedScene';
import { Scene } from '../Scene';

export interface SceneRepository {
  save(scene: Scene): Promise<void>;

  findAll(
    options?: Partial<RequestOptions>
  ): Promise<Scene[] | PopulatedScene[]>;
}
