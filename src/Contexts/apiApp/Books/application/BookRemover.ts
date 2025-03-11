import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { CharacterRepository } from '../../Characters/domain/interfaces';
import { BookRepository } from '../domain/interfaces';

const logger = buildLogger('bookRemover');

export class BookRemover {
  private readonly repository: BookRepository;
  private readonly characterRepository: CharacterRepository;

  constructor(
    repository: BookRepository,
    characterRepository: CharacterRepository
  ) {
    this.repository = repository;
    this.characterRepository = characterRepository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    await this.validateRelations(request);

    await this.repository.remove(request.id);
    logger.info(`Removed Book: <${request.id}> by <${username}>`);
  }

  private async validateRelations(request: RequestById) {
    const characters = await this.characterRepository.findByQuery({
      book: request.id
    });

    if (characters.length > 0) {
      throw createError.conflict(
        `Book <${request.id}> has associated characters`
      );
    }
  }
}
