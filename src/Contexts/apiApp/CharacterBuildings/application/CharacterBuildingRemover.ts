import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { CharacterBuilding } from '../domain';
import { CharacterBuildingRepository } from '../domain/interfaces';

const logger = buildLogger('characterBuildingRemover');

export class CharacterBuildingRemover {
  private readonly repository: CharacterBuildingRepository;

  constructor(repository: CharacterBuildingRepository) {
    this.repository = repository;
  }

  async run(
    request: RequestById,
    user: { username: string; id: string }
  ): Promise<void> {
    await this.validadeOwnership(request, user.id);
    await this.repository.remove(request.id);
    logger.info(
      `Removed CharacterBuilding: <${request.id}> by <${user.username}>`
    );
  }

  private async validadeOwnership(
    request: RequestById,
    id: string
  ): Promise<void> {
    const characterBuilding = await this.repository.search(request.id, {
      fields: ['actor']
    });
    if (!characterBuilding) {
      return;
    }

    if ((characterBuilding as CharacterBuilding).actor?.value !== id) {
      throw createError.forbidden(`You dont own this characterBuilding`);
    }
  }
}
