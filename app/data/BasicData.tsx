import { WeightUnit, Sex, sexToString, weightUnitToString, stringToSex, stringToWeightUnit } from './Units';
import AsyncStorage from '@react-native-community/async-storage';

interface IBasicData {
  sex: Sex;
  weight: number;
  weightUnit: WeightUnit;
}

async function saveBasicDataToStorage(basicData: IBasicData): Promise<void> {
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

async function getBasicDataFromStorage(): Promise<(IBasicData | null)> {
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


export type { IBasicData };
export { saveBasicDataToStorage, getBasicDataFromStorage };
