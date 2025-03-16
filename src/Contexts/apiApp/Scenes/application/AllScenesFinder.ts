import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { Scene } from '../domain';
import { ScenePrimitives, SceneRepository } from '../domain/interfaces';
import { PopulatedScene } from '../domain/PopulatedScene';

export class AllScenesFinder {
  constructor(private readonly repository: SceneRepository) {}

  async run(
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<ScenePrimitives>[]> {
    const scenes: Array<Scene | PopulatedScene> =
      await this.repository.findAll(options);

    return scenes.map((scene) => scene.toPrimitives());
  }
}
