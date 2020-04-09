/********************           Utility functions          ********************/

function enumValueToString<T>(enumStringPairs: [T, string][], value: T): string {
  let result = null;
  enumStringPairs.forEach(tuple => {
    if (tuple[0] === value) {
      result = tuple[1];
    }
  });
  if (result !== null) {
    return result;
  }
  throw "Incorrect enum value: " + value + enumStringPairs;
}

function stringToEnumValue<T>(enumStringPairs: [T, string][], value: string): T {
  let result = null;
  enumStringPairs.forEach(tuple => {
    if (tuple[1] === value) {
      result = tuple[0];
    }
  });
  if (result !== null) {
    return result;
  }
  throw "Incorrect string value!";
}

function listOfEnumValues<T>(enumStringPairs: [T, string][]): T[] {
  return enumStringPairs.map(tuple => tuple[0]);
}


/********************               Sex type               ********************/

enum Sex {
  Female,
  Male,
}

const sexStringPairs: [Sex, string][] = [
  [Sex.Female, "Female"],
  [Sex.Male, "Male"],
];

const listOfSexValues =listOfEnumValues(sexStringPairs);

function sexToString(sex: Sex): string {
  return enumValueToString(sexStringPairs, sex);
}

function stringToSex(sex: string): Sex {
  return stringToEnumValue(sexStringPairs, sex);
}


/********************            WeightUnit type           ********************/

enum WeightUnit {
  Kg,
  Lbs,
  Stone,
}

const weightUnitStringPairs: [WeightUnit, string][] = [
  [WeightUnit.Kg, "kg"],
  [WeightUnit.Lbs, "lbs"],
  [WeightUnit.Stone, "stone"],
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


/********************            VolumeUnit type           ********************/

enum VolumeUnit {
  Cl,
  Dl,
  FlOz,
  UkPint,
  UsPint,
}

const volumeUnitStringPairs: [VolumeUnit, string][] = [
  [VolumeUnit.Cl, "cl"],
  [VolumeUnit.Dl, "dl"],
  [VolumeUnit.FlOz, "fl oz"],
  [VolumeUnit.UkPint, "pink (UK)"],
  [VolumeUnit.UsPint, "pint (US)"],
]

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
