import {
  Character,
  CharacterName
} from '../../../../../src/Contexts/apiApp/Characters/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterMother, CharacterNameMother } from './mothers';

const user = UserMother.random().username.value;
const metadata = new Metadata({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: user,
  updatedBy: user
});

const BASE_CHARACTER = {
  id: UuidMother.random().value,
  name: CharacterNameMother.random().value,
  book: UuidMother.random().value,
  metadata: metadata.toPrimitives()
};

describe('Character', () => {
  it('should create a valid character', () => {
    const character = Character.fromPrimitives(BASE_CHARACTER);

    expect(character).toBeInstanceOf(Character);
  });

  it('should throw an InvalidArgumentError when the id is not a valid uuid', () => {
    expect(() => {
      Character.fromPrimitives({
        ...BASE_CHARACTER,
        id: UuidMother.invalidValue()
      });
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });

  it('should throw an InvalidArgumentError when the book id is not a valid uuid', () => {
    expect(() => {
      Character.fromPrimitives({
        ...BASE_CHARACTER,
        book: UuidMother.invalidValue()
      });
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });

  describe('Character name', () => {
    const INVALID_NAMES = [
      '',
      random.integer(),
      true,
      random.word({ min: CharacterName.MAX_LENGTH + 1 }),
      {},
      []
    ];

    test.each(INVALID_NAMES)(
      'should throw an InvalidArgumentError when the character name is invalid (name: %p)',
      (invalidName) => {
        expect(() => {
          Character.fromPrimitives({
            ...BASE_CHARACTER,
            name: invalidName as unknown as string
          });
        }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
      }
    );
  });

  describe('CharacterMother', () => {
    it('should give a random Character instance', () => {
      expect(CharacterMother.random()).toBeInstanceOf(Character);
    });
  });
});
