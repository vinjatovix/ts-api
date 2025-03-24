import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { SceneRepository } from '../../Scenes/domain/interfaces';
import { CharacterRepository } from '../domain/interfaces';

const logger = buildLogger('characterRemover');

export class CharacterRemover {
  private readonly repository: CharacterRepository;
  private readonly sceneRepository: SceneRepository;

  constructor(
    repository: CharacterRepository,
    sceneRepository: SceneRepository
  ) {
    this.repository = repository;
    this.sceneRepository = sceneRepository;
  }

  async run(request: RequestById, user: { username: string }): Promise<void> {
    await this.validateRelations(request);
    await this.repository.remove(request.id);

    logger.info(`Removed Character: <${request.id}> by <${user.username}>`);
  }

  private async validateRelations(request: RequestById) {
    const scenes = await this.sceneRepository.findByQuery({
      characters: [request.id]
    });

    if (scenes.length) {
      throw createError.conflict(
        `Character <${request.id}> has associated scenes`
      );
    }
  }
}
