import { CharacterCreatorRequest } from '../../../../../../src/Contexts/apiApp/Characters/application';
import { CharacterName } from '../../../../../../src/Contexts/apiApp/Characters/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';

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
}
