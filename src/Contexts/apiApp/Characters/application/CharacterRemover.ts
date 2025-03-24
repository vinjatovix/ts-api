import { RequestById } from '../../../shared/application/interfaces';
import { buildLogger } from '../../../shared/plugins';
import { CharacterRepository } from '../domain/interfaces';

const logger = buildLogger('characterRemover');

export class CharacterRemover {
  private readonly repository: CharacterRepository;

  constructor(repository: CharacterRepository) {
    this.repository = repository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    await this.repository.remove(request.id);

    logger.info(`Removed Character: <${request.id}> by <${username}>`);
  }
}
