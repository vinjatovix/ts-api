import { hasValuesChanges } from '../../../shared/application/utils';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { Username } from '../../Auth/domain';
import { CharacterRepository } from '../../Characters/domain/interfaces';
import { SceneRepository } from '../domain/interfaces';
import { ScenePatch } from '../domain/ScenePatch';

export interface ScenePatcherRequest {
  id: string;
  description?: string;
  characters?: string[];
}

const logger = buildLogger('scenePatcher');

export class ScenePatcher {
  private readonly repository: SceneRepository;
  private readonly characterRepository: CharacterRepository;

  constructor(
    repository: SceneRepository,
    characterRepository: CharacterRepository
  ) {
    this.repository = repository;
    this.characterRepository = characterRepository;
  }

  async run(request: ScenePatcherRequest, username: string): Promise<void> {
    await this.validatePatch(request);
    const scene = ScenePatch.fromPrimitives(request);

    await this.repository.update(scene, new Username(username));
    logger.info(`Updated Scene: <${scene.id}> by <${username}>`);
  }

  private async validatePatch(request: ScenePatcherRequest) {
    const storedScene = await this.repository.search(request.id);
    if (!storedScene) {
      throw createError.notFound(`Scene <${request.id}>`);
    }

    if (
      !hasValuesChanges(
        request as unknown as Record<string, unknown>,
        storedScene
      )
    ) {
      throw createError.invalidArgument('Nothing to update');
    }

    if (request.characters) {
      const missingCharacters = await this.findMissingCharacters(
        request.characters
      );
      if (missingCharacters.length > 0) {
        throw createError.notFound(
          `Characters: ${missingCharacters.join(', ')}`
        );
      }
    }
  }

  private async findMissingCharacters(characters: string[]): Promise<string[]> {
    const results = await Promise.allSettled(
      characters.map((charId) => this.characterRepository.search(charId))
    );

    return results
      .map((result, index) =>
        result.status === 'fulfilled' && result.value ? null : characters[index]
      )
      .filter(Boolean) as string[];
  }
}
