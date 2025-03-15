import { Scene } from '../../../../../src/Contexts/apiApp/Scenes/domain';
import { SceneRepository } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';

export class SceneRepositoryMock implements SceneRepository {
  protected saveMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
  }
  async save(scene: Scene): Promise<void> {
    this.saveMock(scene);
  }

  assertSaveHasBeenCalledWith(expected: Scene): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }
}
