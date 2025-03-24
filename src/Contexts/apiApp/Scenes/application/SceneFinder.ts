import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { Scene } from '../domain';
import { ScenePrimitives, SceneRepository } from '../domain/interfaces';
import { PopulatedScene } from '../domain/PopulatedScene';

export class SceneFinder {
  constructor(private readonly repository: SceneRepository) {}

  async run(
    { id }: RequestById,
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<ScenePrimitives>> {
    const scene = (await this.repository.search(id, options)) as
      | Scene
      | PopulatedScene;

    if (!scene) {
      throw createError.notFound(`Scene <${id}>`);
    }

    return scene.toPrimitives();
  }
}
