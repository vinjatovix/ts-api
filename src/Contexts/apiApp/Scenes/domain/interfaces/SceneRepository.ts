import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Username } from '../../../Auth/domain';
import { PopulatedScene } from '../PopulatedScene';
import { Scene } from '../Scene';
import { ScenePatch } from '../ScenePatch';

export interface SceneRepository {
  save(scene: Scene): Promise<void>;

  findAll(
    options?: Partial<RequestOptions>
  ): Promise<Scene[] | PopulatedScene[]>;

  search(
    id: string,
    options?: Partial<RequestOptions>
  ): Promise<Partial<Scene | PopulatedScene> | null>;

  update(scene: ScenePatch, user: Username): Promise<void>;
}
