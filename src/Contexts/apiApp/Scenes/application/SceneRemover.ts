import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { CharacterBuildingRepository } from '../../CharacterBuildings/domain/interfaces';
import { SceneRepository } from '../domain/interfaces';

const logger = buildLogger('sceneRemover');

export class SceneRemover {
  private readonly repository: SceneRepository;
  private readonly characterBuildingsRepository: CharacterBuildingRepository;

  constructor(
    repository: SceneRepository,
    characterBuildingsRepository: CharacterBuildingRepository
  ) {
    this.repository = repository;
    this.characterBuildingsRepository = characterBuildingsRepository;
  }

  async run(request: RequestById, user: { username: string }): Promise<void> {
    await this.validateRelations(request);
    await this.repository.remove(request.id);

    logger.info(`Removed Scene: <${request.id}> by <${user.username}>`);
  }

  private async validateRelations(request: RequestById) {
    const caracterBuildings =
      await this.characterBuildingsRepository.findByQuery({
        scene: request.id
      });

    if (caracterBuildings.length) {
      throw createError.conflict(
        `Scene <${request.id}> has associated character buildings`
      );
    }
  }
}
