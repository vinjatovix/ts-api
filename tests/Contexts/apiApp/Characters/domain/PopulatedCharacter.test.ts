import { PopulatedCharacter } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { BookMother } from '../../Books/domain/mothers';
import { CharacterNameMother } from './mothers';

const user = UserMother.random().username.value;

const populatedCharacterValueObjects = {
  id: UuidMother.random(),
  name: CharacterNameMother.random(),
  book: BookMother.random(),
  metadata: new Metadata({
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user,
    updatedBy: user
  })
};

describe('PopulatedCharacter', () => {
  it('should create a valid populated Character', () => {
    expect(
      new PopulatedCharacter(populatedCharacterValueObjects)
    ).toMatchObject(populatedCharacterValueObjects);
  });

  it('should return primitives from populated character', () => {
    const populatedBook = new PopulatedCharacter(
      populatedCharacterValueObjects
    );

    const primitives = populatedBook.toPrimitives();

    expect(primitives).toMatchObject({
      id: populatedCharacterValueObjects.id.value,
      name: populatedCharacterValueObjects.name.value,
      metadata: populatedCharacterValueObjects.metadata.toPrimitives(),
      book: populatedCharacterValueObjects.book.toPrimitives()
    });
  });
});
