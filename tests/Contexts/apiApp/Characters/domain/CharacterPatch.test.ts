import { CharacterPatch } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { CharacterNameMother } from './mothers';

const BASE_CHARACTER = {
  id: UuidMother.random().value,
  name: CharacterNameMother.random().value,
  book: UuidMother.random().value
};

describe('CharacterPatch', () => {
  it('should create a valid character', () => {
    const patch = CharacterPatch.fromPrimitives(BASE_CHARACTER);

    expect(patch).toBeInstanceOf(CharacterPatch);
  });

  it('should fail if there is nothing to patch', () => {
    expect(() => {
      CharacterPatch.fromPrimitives({
        id: BASE_CHARACTER.id
      });
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });
});
