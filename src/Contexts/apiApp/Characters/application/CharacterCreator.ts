import { Metadata } from '../../../shared/domain/valueObject';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { BookRepository } from '../../Books/domain/interfaces';
import { Character } from '../domain';
import { CharacterRepository } from '../domain/interfaces';
import { CharacterCreatorRequest } from './interfaces';

const logger = buildLogger('characterCreator');

export class CharacterCreator {
  private readonly repository: CharacterRepository;
  private readonly bookRepository: BookRepository;

  constructor(repository: CharacterRepository, bookRepository: BookRepository) {
    this.repository = repository;
    this.bookRepository = bookRepository;
  }
  async run(request: CharacterCreatorRequest, username: string): Promise<void> {
    await this.validateDependencies(request);

    const character = Character.fromPrimitives({
      ...request,
      metadata: new Metadata({
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      })
    });

    await this.repository.save(character);
    logger.info(`Created Character: <${character.id.value}> by <${username}>`);
  }

  private async validateDependencies(
    request: CharacterCreatorRequest
  ): Promise<void> {
    await this.validateBookExistence(request.book);
    await this.validateCharExistence(request);
  }

  private async validateCharExistence(request: CharacterCreatorRequest) {
    const storedCharacter = await this.repository.findByQuery(request);
    if (storedCharacter.length) {
      throw createError.invalidArgument(`Character exists`);
    }
  }

  private async validateBookExistence(book: string) {
    if (typeof book !== 'string') {
      throw createError.invalidArgument('Book must be a valid Uuid');
    }
    const storedBook = await this.bookRepository.search(book);
    if (!storedBook) {
      throw createError.invalidArgument(`Book <${book}> does not exist`);
    }
  }
}
