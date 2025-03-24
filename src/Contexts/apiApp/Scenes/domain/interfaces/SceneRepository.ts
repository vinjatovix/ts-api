import { Scene } from '../Scene';

export interface SceneRepository {
  save(scene: Scene): Promise<void>;
}
