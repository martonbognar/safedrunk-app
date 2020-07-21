import { listOfEnumValues, enumValueToString, stringToEnumValue } from "../utils/Enums";

/*
 * SEX TYPE
 */

enum Sex {
  Female,
  Male,
}

const sexStringPairs: [Sex, string][] = [
  [Sex.Female, 'Female'],
  [Sex.Male, 'Male'],
];

const listOfSexValues = listOfEnumValues(sexStringPairs);

function sexToString(sex: Sex): string {
  return enumValueToString(sexStringPairs, sex);
}

function stringToSex(sex: string): Sex {
  return stringToEnumValue(sexStringPairs, sex);
}


/*
 * WEIGHT UNIT TYPE
 */

enum WeightUnit {
  Kg,
  Lbs,
  Stone,
}

const weightUnitStringPairs: [WeightUnit, string][] = [
  [WeightUnit.Kg, 'kg'],
  [WeightUnit.Lbs, 'lbs'],
  [WeightUnit.Stone, 'stone'],
];

const listOfWeightUnitValues = listOfEnumValues(weightUnitStringPairs);

function weightUnitToString(unit: WeightUnit): string {
  return enumValueToString(weightUnitStringPairs, unit);
}

function stringToWeightUnit(unit: string): WeightUnit {
  return stringToEnumValue(weightUnitStringPairs, unit);
}

function weightToKg(amount: number, unit: WeightUnit): number {
  switch (unit) {
    case WeightUnit.Kg:
      return amount * 1;
    case WeightUnit.Lbs:
      return amount * 0.4536;
    case WeightUnit.Stone:
      return amount * 6.3503;
  }
}


/*
 * VOLUME UNIT TYPE
 */

enum VolumeUnit {
  Cl,
  Dl,
  FlOz,
  UkPint,
  UsPint,
}

const volumeUnitStringPairs: [VolumeUnit, string][] = [
  [VolumeUnit.Cl, 'cl'],
  [VolumeUnit.Dl, 'dl'],
  [VolumeUnit.FlOz, 'fl oz'],
  [VolumeUnit.UkPint, 'pink (UK)'],
  [VolumeUnit.UsPint, 'pint (US)'],
];

const listOfVolumeUnitValues = listOfEnumValues(volumeUnitStringPairs);

function volumeUnitToString(unit: VolumeUnit): string {
  return enumValueToString(volumeUnitStringPairs, unit);
}

function stringToVolumeUnit(unit: string): VolumeUnit {
  return stringToEnumValue(volumeUnitStringPairs, unit);
}

function volumeToCl(amount: number, unit: VolumeUnit): number {
  switch (unit) {
    case VolumeUnit.Cl:
      return amount * 1;
    case VolumeUnit.Dl:
      return amount * 10;
    case VolumeUnit.FlOz:
      return amount * 2.9;
    case VolumeUnit.UkPint:
      return amount * 56.8;
    case VolumeUnit.UsPint:
      return amount * 47.2;
  }
}

/*
 * EXPORT
 */

export {
  Sex,
  listOfSexValues,
  stringToSex,
  sexToString,
  WeightUnit,
  listOfWeightUnitValues,
  weightUnitToString,
  stringToWeightUnit,
  weightToKg,
  VolumeUnit,
  listOfVolumeUnitValues,
  volumeUnitToString,
  stringToVolumeUnit,
  volumeToCl,
};
