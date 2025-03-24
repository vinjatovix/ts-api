import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Scene } from '../../../../../src/Contexts/apiApp/Scenes/domain';
import { SceneRepository } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { SceneMother } from '../domain/mothers';

export class SceneRepositoryMock implements SceneRepository {
  protected saveMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  protected findMock: jest.Mock;
  private isFindable: boolean;

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isFindable = find;
    this.saveMock = jest.fn();
    this.findAllMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? [SceneMother.random()] : [];
    });
    this.findMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? SceneMother.random() : null;
    });
  }

  async findAll(options?: Partial<RequestOptions>): Promise<Scene[]> {
    return this.findAllMock(options);
  }

  assertFindAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  assertFindAllHasBeenCalledWith(options: Partial<RequestOptions>): void {
    expect(this.findAllMock).toHaveBeenCalledWith(options);
  }

  async save(scene: Scene): Promise<void> {
    this.saveMock(scene);
  }

  assertSaveHasBeenCalledWith(expected: Scene): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  setFindable(findable: boolean): void {
    this.isFindable = findable;
  }

  async search(
    id: string,
    options?: Partial<RequestOptions>
  ): Promise<Scene | null> {
    return this.findMock(id, options);
  }

  assertSearchHasBeenCalledWith(
    expected: string,
    options?: Partial<RequestOptions>
  ): void {
    expect(this.findMock).toHaveBeenCalledWith(expected, options);
  }
}
