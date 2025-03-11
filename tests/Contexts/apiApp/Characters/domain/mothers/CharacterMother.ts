import { CharacterCreatorRequest } from '../../../../../../src/Contexts/apiApp/Characters/application/CharacterCreatorRequest';
import {
  Uuid,
  Metadata
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import {
  Character,
  CharacterName
} from '../../../../../../src/Contexts/apiApp/Characters/domain';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../../Auth/domain/mothers';
import { CharacterNameMother } from './CharacterNameMother';

export class CharacterMother {
  static create({
    id,
    name,
    book,
    metadata = new Metadata({
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: UserMother.random().username.value,
      updatedBy: UserMother.random().username.value
    })
  }: {
    id: Uuid;
    name: CharacterName;
    book: Uuid;
    metadata?: Metadata;
  }): Character {
    return new Character({
      id,
      name,
      book,
      metadata
    });
  }

  static from(
    command: CharacterCreatorRequest,
    username: string,
    metadata?: Metadata
  ): Character {
    return new Character({
      id: new Uuid(command.id),
      name: new CharacterName(command.name),
      book: new Uuid(command.book),
      metadata:
        metadata ||
        new Metadata({
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: username,
          updatedBy: username
        })
    });
  }

  static random(id?: string): Character {
    return this.create({
      id: id ? UuidMother.create(id) : UuidMother.random(),
      name: CharacterNameMother.random(),
      book: UuidMother.random()
    });
  }
}
