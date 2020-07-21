function enumValueToString<T>(
    enumStringPairs: [T, string][],
    value: T,
): string {
    let result = null;
    enumStringPairs.forEach(tuple => {
        if (tuple[0] === value) {
            result = tuple[1];
        }
    });
    if (result !== null) {
        return result;
    }
    throw 'Incorrect enum value: ' + value + enumStringPairs;
}

function stringToEnumValue<T>(
    enumStringPairs: [T, string][],
    value: string,
): T {
    let result = null;
    enumStringPairs.forEach(tuple => {
        if (tuple[1] === value) {
            result = tuple[0];
        }
    });
    if (result !== null) {
        return result;
    }
    throw 'Incorrect string value!';
}

function listOfEnumValues<T>(enumStringPairs: [T, string][]): T[] {
    return enumStringPairs.map(tuple => tuple[0]);
}

export {
    enumValueToString,
    stringToEnumValue,
    listOfEnumValues,
  };
