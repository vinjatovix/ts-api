import { Author } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorRepositoryMock } from './AuthorRepositoryMock';

export class CreateAuthorRepositoryMock extends AuthorRepositoryMock {
  protected findMock: jest.Mock;

  constructor() {
    super();
    this.findMock = jest.fn();
  }

  async search(id: string): Promise<Author | null> {
    if (id === 'existing-id') {
      this.findMock = jest.fn().mockReturnValue({});
    } else {
      this.findMock = jest.fn().mockReturnValue(null);
    }

    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }
}
