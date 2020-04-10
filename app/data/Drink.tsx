import { VolumeUnit, sexToString, weightUnitToString, volumeUnitToString, stringToVolumeUnit } from './Units';
import AsyncStorage from '@react-native-community/async-storage';

interface Drink {
  key: string;
  id: number;
  name: string;
  percentage: number;
  startTime: Date;
  unit: VolumeUnit;
  volume: number;
}

async function saveDrinksToStore(drinks: Drink[]) {
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

async function saveDrinkToStore(drink: Drink) {
  const drinks = await loadDrinksFromStore();
  drinks.push(drink);
  return saveDrinksToStore(drinks);
}

async function deleteDrinkFromStore(drink: Drink) {
  const drinks = await loadDrinksFromStore();

  let index = -1;
  drinks.forEach(function (d, i) {
    if (d.key === drink.key) {
      index = i;
    }
  });
  drinks.splice(index, 1);

  return saveDrinksToStore(drinks);
}

async function loadDrinksFromStore(): Promise<Drink[]> {
  const drinksString = await AsyncStorage.getItem('drinks');
  if (drinksString === null) {
    return [];
  } else {
    const drinksRaw = JSON.parse(drinksString);
    return drinksRaw.map(d => ({
      key: d.key,
      id: d.id,
      name: d.name,
      percentage: d.percentage,
      startTime: new Date(d.startTime),
      unit: stringToVolumeUnit(d.unit),
      volume: d.volume,
    }));
  }
}

export type { Drink };
export { saveDrinkToStore, deleteDrinkFromStore, loadDrinksFromStore };
