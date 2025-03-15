import { CharacterCreatorRequest } from '../../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { CharacterName } from '../../../../../../src/Contexts/apiApp/Characters/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import { CharacterNameMother } from '../../domain/mothers';

export class CharacterCreatorRequestMother {
  static create({
    id,
    name,
    book
  }: {
    id: Uuid;
    name: CharacterName;
    book: Uuid;
  }): CharacterCreatorRequest {
    return { id: id.value, name: name.value, book: book.value };
  }

  static random(id?: string): CharacterCreatorRequest {
    return this.create({
      id: id ? UuidMother.create(id) : UuidMother.random(),
      name: CharacterNameMother.random(),
      book: UuidMother.random()
    });
  }
}
