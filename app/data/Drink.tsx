import {VolumeUnit} from './Units';

export default interface Drink {
  key: string;
  id: number;
  name: string;
  percentage: number;
  startTime: Date;
  unit: VolumeUnit;
  volume: number;
}
