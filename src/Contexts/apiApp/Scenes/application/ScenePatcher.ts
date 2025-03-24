import { hasValuesChanges } from '../../../shared/application/utils';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { Username } from '../../Auth/domain';
import { CharacterRepository } from '../../Characters/domain/interfaces';
import { SceneRepository } from '../domain/interfaces';
import { ScenePatch } from '../domain/ScenePatch';
import { ScenePatcherRequest } from './interfaces';

const logger = buildLogger('scenePatcher');

export class ScenePatcher {
  constructor(
    private readonly repository: SceneRepository,
    private readonly characterRepository: CharacterRepository
  ) {}

  async run(
    request: ScenePatcherRequest,
    user: { username: string }
  ): Promise<void> {
    await this.validatePatch(request);
    const scene = ScenePatch.fromPrimitives(request);

    await this.repository.update(scene, new Username(user.username));
    logger.info(`Updated Scene: <${scene.id}> by <${user.username}>`);
  }

  private async validatePatch(request: ScenePatcherRequest): Promise<void> {
    const storedScene = await this.repository.search(request.id);
    if (!storedScene) {
      throw createError.notFound(`Scene <${request.id}>`);
    }

    if (!hasValuesChanges(request, storedScene)) {
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
