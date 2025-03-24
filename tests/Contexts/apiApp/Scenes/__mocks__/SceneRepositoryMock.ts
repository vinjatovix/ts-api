import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { SceneByQuery } from '../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import {
  Scene,
  ScenePatch
} from '../../../../../src/Contexts/apiApp/Scenes/domain';
import { SceneRepository } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { SceneMother } from '../domain/mothers';

export class SceneRepositoryMock implements SceneRepository {
  private readonly saveMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  private readonly findMock: jest.Mock;
  private readonly updateMock: jest.Mock;
  private readonly findByQueryMock: jest.Mock;
  private readonly removeMock: jest.Mock;
  private isFindable: boolean;
  private readonly storage: Scene[];

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isFindable = find;
    this.storage = [SceneMother.random()];
    this.saveMock = jest.fn();
    this.findAllMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? this.storage : [];
    });
    this.findMock = jest.fn().mockImplementation((id) => {
      const foundItem = this.storage.find((scene) => scene.id.value === id);

      return this.isFindable && !foundItem ? this.storage[0] : foundItem;
    });
    this.updateMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation((query, _options) => {
      if (this.isFindable) {
        return this.storage;
      }
      return this.storage.filter((scene) => {
        if (query.characters) {
          return scene?.characters?.some((character) =>
            query.characters?.includes(character.value)
          );
        }
        if (query.id) {
          return scene.id === query.id;
        }
        return true;
      });
    });
    this.removeMock = jest.fn();
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

  async update(scene: ScenePatch, user: Username): Promise<void> {
    this.updateMock(scene, user);
  }

  assertUpdateHasBeenCalledWith(expected: Scene, user: Username): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, user);
  }

  async remove(id: string): Promise<void> {
    this.removeMock(id);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }

  async findByQuery(
    query: SceneByQuery,
    options: RequestOptions
  ): Promise<Scene[]> {
    return this.findByQueryMock(query, options);
  }

  assertFindByQueryHasBeenCalledWith(
    expected: SceneByQuery,
    options: RequestOptions
  ): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected, options);
  }

  addToStorage(scene: Scene): void {
    this.storage.push(scene);
  }
}
