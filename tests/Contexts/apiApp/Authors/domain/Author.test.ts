import {
  Author,
  AuthorName
} from '../../../../../src/Contexts/apiApp/Authors/domain';
import { InvalidArgumentError } from '../../../../../src/Contexts/shared/domain/errors/InvalidArgumentError';
import { Uuid } from '../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { AuthorNameMother } from './mothers/AuthorNameMother';

describe('Author', () => {
  it('should create a valid author', () => {
    const authorValueObjects = {
      id: Uuid.random(),
      name: AuthorNameMother.random()
    };

    expect(new Author(authorValueObjects)).toEqual(authorValueObjects);
  });

  it('should throw an error when the id is not a valid uuid', () => {
    let id;
    expect(() => {
      id = new Uuid(UuidMother.invalidValue());
    }).toThrow(InvalidArgumentError);

    expect(id).toBeUndefined();
  });

  it('should throw an error when the author name is too long', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('max-length'));
    }).toThrow(InvalidArgumentError);

    expect(name).toBeUndefined();
  });

  it('should throw an error when the author name is too short', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('min-length'));
    }).toThrow(InvalidArgumentError);

    expect(name).toBeUndefined();
  });

  it('should throw an error when the author name is not a string', () => {
    let name;
    expect(() => {
      // @ts-expect-error Testing purposes
      name = new AuthorName(AuthorNameMother.invalidValue('invalid-type'));
    }).toThrow(InvalidArgumentError);

    expect(name).toBeUndefined();
  });
});
