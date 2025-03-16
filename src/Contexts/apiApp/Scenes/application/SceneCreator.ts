import { createError } from '../../../shared/domain/errors';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { buildLogger } from '../../../shared/plugins';
import { Scene, SceneCircumstance } from '../domain';
import { SceneRepository } from '../domain/interfaces';
import { SceneCreatorRequest } from './interfaces';
import { CharacterRepository } from '../../Characters/domain/interfaces/CharacterRepository';

const logger = buildLogger('sceneCreator');

export class SceneCreator {
  private readonly repository: SceneRepository;
  private readonly characterRepository: CharacterRepository;

  constructor(
    repository: SceneRepository,
    characterRepository: CharacterRepository
  ) {
    this.repository = repository;
    this.characterRepository = characterRepository;
  }

  async run(request: SceneCreatorRequest, username: string): Promise<void> {
    await this.validateDependencies(request);

    const scene = new Scene({
      id: new Uuid(request.id),
      description: new SceneCircumstance(request.description),
      characters: request.characters.map((c) => new Uuid(c)),
      metadata: new Metadata({
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      })
    });

    await this.repository.save(scene);
    logger.info(`Created Scene: <${scene.id.value}> by <${username}>`);
  }

  private async validateDependencies(
    request: SceneCreatorRequest
  ): Promise<void> {
    if (request.characters.length) {
      const filter = {
        _id: { $in: request.characters }
      };
      const characters = await this.characterRepository.findByQuery(filter);

      if (characters.length !== request.characters.length) {
        const storedIds = characters.map((char) => char.id.value);
        const missingChars = request.characters.filter(
          (id) => !storedIds.includes(id)
        );
        throw createError.notFound(`Characters ${missingChars.join(', ')}`);
      }
    }
  }
}
