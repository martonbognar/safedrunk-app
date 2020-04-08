import { WeightUnit, Sex, sexToString, weightUnitToString, stringToSex, stringToWeightUnit } from './Units';
import AsyncStorage from '@react-native-community/async-storage';

interface BasicData {
  sex: Sex;
  weight: number;
  weightUnit: WeightUnit;
}

async function saveBasicDataToStorage(basicData: BasicData): Promise<void> {
  try {
    await AsyncStorage.setItem('basicData', JSON.stringify({
      sex: sexToString(basicData.sex),
      weight: basicData.weight,
      weightUnit: weightUnitToString(basicData.weightUnit),
    }));
  } catch (e) {
    throw e.toString();
  }
}

async function getBasicDataFromStorage(): Promise<(BasicData | null)> {
  const value = await AsyncStorage.getItem('basicData');
  if (value === null) {
    return null;
  }
  else {
    const basicDataRaw = JSON.parse(value);
    return {
      sex: stringToSex(basicDataRaw.sex),
      weight: parseFloat(basicDataRaw.weight),
      weightUnit: stringToWeightUnit(basicDataRaw.weightUnit),
    };
  }
}


export type { BasicData };
export { saveBasicDataToStorage, getBasicDataFromStorage };
