import { SceneCreatorRequest } from '../../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import {
  Scene,
  SceneProps
} from '../../../../../../src/Contexts/apiApp/Scenes/domain';
import {
  Metadata,
  Uuid
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../../Auth/domain/mothers';
import { SceneCircumstanceMother } from './SceneCircumstanceMother';

export class SceneMother {
  static create({ id, description, characters, metadata }: SceneProps) {
    return new Scene({ id, description, characters, metadata });
  }

  static from(command: SceneCreatorRequest, username: string): Scene {
    return this.create({
      id: UuidMother.create(command.id),
      description: SceneCircumstanceMother.create(command.description),
      characters: command.characters.map((c) => UuidMother.create(c)),
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: username,
        updatedBy: username
      })
    });
  }

  static random({
    id,
    characters
  }: { id?: string; characters?: Uuid[] } = {}): Scene {
    return this.create({
      id: id ? UuidMother.create(id) : UuidMother.random(),
      description: SceneCircumstanceMother.random(),
      characters: characters ?? [UuidMother.random(), UuidMother.random()],
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: UserMother.random().username.value,
        updatedBy: UserMother.random().username.value
      })
    });
  }
}
