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
  protected saveMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  protected findMock: jest.Mock;
  private readonly updateMock: jest.Mock;
  private readonly findByQueryMock: jest.Mock;
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
    this.updateMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? [SceneMother.random()] : [];
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

  async update(scene: ScenePatch, user: Username): Promise<void> {
    this.updateMock(scene, user);
  }

  assertUpdateHasBeenCalledWith(expected: Scene, user: Username): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, user);
  }

  async findByQuery(query: SceneByQuery): Promise<Scene[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: SceneByQuery): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }
}
