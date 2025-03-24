import {
  Author,
  AuthorName
} from '../../../../../src/Contexts/apiApp/Authors/domain';
import {
  Uuid,
  Metadata
} from '../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorNameMother } from './mothers';

const user = UserMother.random().username.value;
const metadata = new Metadata({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: user,
  updatedBy: user
});

describe('Author', () => {
  it('should create a valid author', () => {
    const authorValueObjects = {
      id: Uuid.random(),
      name: AuthorNameMother.random(),
      metadata
    };

    expect(new Author(authorValueObjects)).toEqual(authorValueObjects);
  });

  it('should throw an error when the id is not a valid uuid', () => {
    let id;
    expect(() => {
      id = new Uuid(UuidMother.invalidValue());
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

    expect(id).toBeUndefined();
  });

  it('should throw an error when the author name is too long', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('max-length'));
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

    expect(name).toBeUndefined();
  });

  it('should throw an error when the author name is too short', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('min-length'));
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

    expect(name).toBeUndefined();
  });

  it('should throw an error when the author name is not a string', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('invalid-type'));
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

    expect(name).toBeUndefined();
  });
});
