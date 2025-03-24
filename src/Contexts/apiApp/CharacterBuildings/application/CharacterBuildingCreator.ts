import { buildLogger } from '../../../shared/plugins';
import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { UserRepository } from '../../Auth/domain/interfaces';
import { SceneRepository } from '../../Scenes/domain/interfaces';
import {
  CharacterBuildingRepository,
  RelationshipCircumstancePrimitives
} from '../domain/interfaces';
import { CharacterBuilding } from '../domain';
import { CharacterBuildingCreatorRequest } from './interfaces';

const logger = buildLogger('characterBuildingCreator');

export class CharacterBuildingCreator {
  constructor(
    private readonly repository: CharacterBuildingRepository,
    private readonly userRepository: UserRepository,
    private readonly sceneRepository: SceneRepository
  ) {}

  async run(
    request: CharacterBuildingCreatorRequest,
    username: string
  ): Promise<void> {
    await this.validateDependencies(request);

    const payload = CharacterBuilding.fromPrimitives({
      ...request,
      metadata: {
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      }
    });

    await this.repository.save(payload);
    logger.info(
      `Created CharacterBuilding <${payload.id.value}> by <${username}>`
    );
  }

  private async validateDependencies({
    id,
    actor,
    scene,
    character,
    relationshipCircumstances
  }: CharacterBuildingCreatorRequest): Promise<void> {
    await this.avoidOverwite(id);
    await this.validateActorExistence(actor);
    await this.validateScene({
      scene,
      character,
      relationshipCircumstances
    } as {
      scene: string;
      character: string;
      relationshipCircumstances: RelationshipCircumstancePrimitives[];
    });
  }

  private async validateActorExistence(actor: string): Promise<void> {
    const users = await this.userRepository.findByQuery({ id: actor });
    if (!users.length) {
      throw createError.notFound(`Actor <${actor}>`);
    }
  }

  private async validateScene({
    scene,
    character,
    relationshipCircumstances
  }: {
    scene: string;
    character: string;
    relationshipCircumstances: RelationshipCircumstancePrimitives[];
  }): Promise<void> {
    const storedScene = (await this.sceneRepository.search(scene, {
      fields: ['characters']
    })) as { characters: Uuid[] } | null;

    if (!storedScene) {
      throw createError.notFound(`Scene <${scene}>`);
    }

    const characters = (storedScene.characters ?? []).map((c) => c.value);
    const errors: string[] = [];

    if (!characters.includes(character)) {
      errors.push(`<${character}>`);
    }

    relationshipCircumstances.forEach(({ character }) => {
      if (!characters.includes(character as string)) {
        errors.push(`<${character}>`);
      }
    });

    if (errors.length > 0) {
      const message = `Character(s) ${errors.join(', ')} not found in Scene <${scene}>`;
      throw createError.conflict(message);
    }
  }

  private async avoidOverwite(id: string): Promise<void> {
    const build = await this.repository.findByQuery({ id });

    if (build.length) {
      throw createError.conflict(`CharacterBuilding: <${id}> already exists.`);
    }
  }
}
