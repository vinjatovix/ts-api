import { hasValuesChanges } from '../../../shared/application/utils';
import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { buildLogger } from '../../../shared/plugins';
import { Username } from '../../Auth/domain';
import { UserRepository } from '../../Auth/domain/interfaces';
import { Scene } from '../../Scenes/domain';
import { SceneRepository } from '../../Scenes/domain/interfaces';
import { CharacterBuilding } from '../domain';
import { CharacterBuildingPatch } from '../domain/CharacterBuildingPatch';
import { CharacterBuildingRepository } from '../domain/interfaces';
import { PopulatedCharacterBuilding } from '../domain/PopulatedCharacterBuilding';
import { CharacterBuildingPatcherRequest } from './interfaces/CharacterBuildingPatcherRequest';

const logger = buildLogger('characterBuildingPatcher');

export class CharacterBuildingPatcher {
  constructor(
    private readonly repository: CharacterBuildingRepository,
    private readonly userRepository: UserRepository,
    private readonly sceneRepository: SceneRepository
  ) {}

  async run(
    request: CharacterBuildingPatcherRequest,
    user: { username: string; id: string }
  ): Promise<void> {
    await this.validatePatch(request, user.id);
    const characterBuilding = CharacterBuildingPatch.fromPrimitives(request);

    await this.repository.update(
      characterBuilding,
      new Username(user.username)
    );
    logger.info(
      `Updated CharacterBuilding: <${characterBuilding.id}> by <${user.username}>`
    );
  }

  private async validatePatch(
    request: CharacterBuildingPatcherRequest,
    userId: string
  ): Promise<void> {
    const storedCharacterBuilding = await this.repository.search(request.id);

    if (!storedCharacterBuilding) {
      throw createError.notFound(`CharacterBuilding <${request.id}>`);
    }

    if (!hasValuesChanges(request, storedCharacterBuilding)) {
      throw createError.invalidArgument('Nothing to update');
    }

    if ((storedCharacterBuilding.actor as Uuid)?.value !== userId) {
      throw createError.forbidden(`You dont own this characterBuilding`);
    }

    await this.validateActorExistence(request.actor);

    await this.validateScene(request, storedCharacterBuilding);
  }

  private async validateActorExistence(actor?: string): Promise<void> {
    if (!actor) {
      return;
    }
    const user = await this.userRepository.findByQuery({ id: actor });
    if (!user.length) {
      throw createError.notFound(`Actor <${actor}>`);
    }
  }

  private async validateScene(
    {
      scene,
      character,
      relationshipCircumstances
    }: {
      scene?: string;
      character?: string;
      relationshipCircumstances?: { character: string }[];
    },
    storedCharacterBuilding: Partial<
      CharacterBuilding | PopulatedCharacterBuilding
    >
  ): Promise<void> {
    const storedScene = await this.getStoredScene(scene);

    if (character || relationshipCircumstances) {
      const characters = await this.getSceneCharacters(
        storedScene,
        storedCharacterBuilding
      );
      this.validateCharactersInScene(
        characters,
        character,
        relationshipCircumstances,
        scene
      );
    }
  }

  private async getStoredScene(scene?: string): Promise<Partial<Scene> | null> {
    if (!scene) {
      return null;
    }
    const storedScene = (await this.sceneRepository.search(scene, {
      include: ['characters'],
      fields: ['characters']
    })) as { characters: Uuid[] } | null;
    if (!storedScene) {
      throw createError.notFound(`Scene <${scene}>`);
    }
    return storedScene;
  }

  private async getSceneCharacters(
    storedScene: Partial<Scene> | null,
    storedCharacterBuilding: Partial<
      CharacterBuilding | PopulatedCharacterBuilding
    >
  ): Promise<string[]> {
    const charactersSource =
      storedScene ||
      (await this.sceneRepository.search(
        (storedCharacterBuilding.scene instanceof Uuid
          ? storedCharacterBuilding.scene.value
          : storedCharacterBuilding.scene) as string,
        {
          include: ['characters'],
          fields: ['characters']
        }
      ));
    return (charactersSource?.characters ?? []).map((c) => (c as Uuid).value);
  }

  private validateCharactersInScene(
    characters: string[],
    character?: string,
    relationshipCircumstances?: { character: string }[],
    scene?: string
  ): void {
    const errors: string[] = [];

    if (character && !characters.includes(character)) {
      errors.push(`<${character}>`);
    }

    if (relationshipCircumstances) {
      for (const rc of relationshipCircumstances) {
        if (!characters.includes(rc.character)) {
          errors.push(`<${rc.character}>`);
        }
      }
    }

    if (errors.length) {
      const message = `Character(s) ${errors.join(', ')} not found in Scene <${scene}>`;
      throw createError.conflict(message);
    }
  }
}
