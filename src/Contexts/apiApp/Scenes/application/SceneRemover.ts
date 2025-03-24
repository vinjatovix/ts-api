import { RequestById } from '../../../shared/application/interfaces';
import { buildLogger } from '../../../shared/plugins';
import { SceneRepository } from '../domain/interfaces';

const logger = buildLogger('sceneRemover');

export class SceneRemover {
  private readonly repository: SceneRepository;

  constructor(repository: SceneRepository) {
    this.repository = repository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    await this.repository.remove(request.id);

    logger.info(`Removed Scene: <${request.id}> by <${username}>`);
  }
}
