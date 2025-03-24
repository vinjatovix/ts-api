import { hasValuesChanges } from '../../../shared/application/utils';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { Username } from '../../Auth/domain';
import { BookRepository } from '../../Books/domain/interfaces';
import { CharacterRepository } from '../domain/interfaces';
import { CharacterPatch } from '../domain/CharacterPatch';
import { CharacterPatcherRequest } from './interfaces';

const logger = buildLogger('characterPatcher');

export class CharacterPatcher {
  private readonly repository: CharacterRepository;
  private readonly bookRepository: BookRepository;

  constructor(repository: CharacterRepository, bookRepository: BookRepository) {
    this.repository = repository;
    this.bookRepository = bookRepository;
  }

  async run(
    request: CharacterPatcherRequest,
    user: { username: string }
  ): Promise<void> {
    await this.validatePatch(request);
    const char = CharacterPatch.fromPrimitives(request);

    await this.repository.update(char, new Username(user.username));
    logger.info(`Updated Character: <${char.id}> by <${user.username}>`);
  }

  private async validatePatch(request: CharacterPatcherRequest) {
    const storedCharacter = await this.repository.search(request.id);
    if (!storedCharacter) {
      throw createError.notFound(`Character <${request.id}>`);
    }

    if (
      !hasValuesChanges(
        request as unknown as Record<string, unknown>,
        storedCharacter
      )
    ) {
      throw createError.invalidArgument('Nothing to update');
    }

    if (request.book) {
      const book = await this.bookRepository.search(request.book);
      if (!book) {
        throw createError.notFound(`Book <${request.book}>`);
      }
    }
  }
}
