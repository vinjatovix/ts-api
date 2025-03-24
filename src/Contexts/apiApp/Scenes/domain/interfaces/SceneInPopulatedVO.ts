import { Uuid } from '../../../../shared/domain/valueObject';
import { PopulatedScene } from '../PopulatedScene';
import { Scene } from '../Scene';

export type SceneInPopulatedVO = Uuid | Scene | PopulatedScene;
