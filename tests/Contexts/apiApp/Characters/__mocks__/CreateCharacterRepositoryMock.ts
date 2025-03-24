import { Character } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterRepositoryMock } from './CharacterRepositoryMock';

export class CreateCharacterRepositoryMock extends CharacterRepositoryMock {
  protected findMock: jest.Mock;

  constructor({ find }: { find: boolean } = { find: false }) {
    super({ find });
    this.findMock = jest.fn();
  }

  async search(id: string): Promise<Character | null> {
    this.findMock = jest.fn().mockReturnValue(null);

    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }
}
