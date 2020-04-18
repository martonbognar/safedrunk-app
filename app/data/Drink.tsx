import { VolumeUnit, sexToString, weightUnitToString, volumeUnitToString, stringToVolumeUnit } from './Units';
import AsyncStorage from '@react-native-community/async-storage';

interface IDrink {
  key: string;
  id: number;
  name: string;
  percentage: number;
  startTime: Date;
  unit: VolumeUnit;
  volume: number;
}

async function saveDrinksToStore(drinks: IDrink[]) {
  return AsyncStorage.setItem('drinks', JSON.stringify(drinks.map(d => ({
    key: d.key,
    id: d.id,
    name: d.name,
    percentage: d.percentage,
    startTime: d.startTime,
    unit: volumeUnitToString(d.unit),
    volume: d.volume,
  }))));
}

async function saveDrinkToStore(drink: IDrink) {
  const [drinks, _] = await loadDrinksFromStore();
  drinks.push(drink);
  return saveDrinksToStore(drinks);
}

async function deleteDrinkFromStore(drink: IDrink) {
  const [drinks, _] = await loadDrinksFromStore();

  let index = -1;
  drinks.forEach(function (d, i) {
    if (d.id === drink.id) {
      index = i;
    }
  });
  drinks.splice(index, 1);

  return saveDrinksToStore(drinks);
}

async function loadDrinksFromStore(): Promise<[IDrink[], number]> {
  const drinksString = await AsyncStorage.getItem('drinks');
  if (drinksString === null) {
    return [[], 0];
  } else {
    const drinksRaw = JSON.parse(drinksString);
    const drinks: IDrink[] = drinksRaw.map(d => ({
      key: d.key,
      id: d.id,
      name: d.name,
      percentage: d.percentage,
      startTime: new Date(d.startTime),
      unit: stringToVolumeUnit(d.unit),
      volume: d.volume,
    }));
    if (drinks.length === 0) {
      return [[], 0];
    }
    return [drinks, Math.max(...drinks.map(d => d.id))]
  }
}

export type { IDrink };
export { saveDrinkToStore, deleteDrinkFromStore, loadDrinksFromStore };
