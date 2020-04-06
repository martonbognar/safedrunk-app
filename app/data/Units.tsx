enum Sex {
  Female,
  Male,
}

enum WeightUnit {
  Kg,
  Lbs,
  Stone,
}

function weightUnitToString(unit: WeightUnit): string {
  switch (unit) {
    case WeightUnit.Kg:
      return 'kg';
    case WeightUnit.Lbs:
      return 'lbs';
    case WeightUnit.Stone:
      return 'stone';
  }
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

enum VolumeUnit {
  Cl,
  Dl,
  FlOz,
  UkPint,
  UsPint,
}

function volumeUnitToString(unit: VolumeUnit): string {
  switch (unit) {
    case VolumeUnit.Cl:
      return 'cl';
    case VolumeUnit.Dl:
      return 'dl';
    case VolumeUnit.FlOz:
      return 'fl oz';
    case VolumeUnit.UkPint:
      return 'pint (UK)';
    case VolumeUnit.UsPint:
      return 'pint (US)';
  }
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
  WeightUnit,
  weightUnitToString,
  weightToKg,
  VolumeUnit,
  volumeUnitToString,
  volumeToCl,
};
