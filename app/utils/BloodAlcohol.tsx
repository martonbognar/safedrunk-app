import {Sex, volumeToCl, weightToKg} from '../data/Units';
import {IDrink} from '../data/Drink';
import {IBasicData} from '../data/BasicData';
import { prettyPrintHoursMinutes } from './Strings';


/**
 * For a list of drinks, returns the Date of the first (oldest) and last
 * (newest) drink's creation date.
 */
function firstAndLastTime(drinks: IDrink[]): [Date, Date] {
  let firstDot = new Date(drinks[0].startTime.getTime());
  let lastDot = new Date(drinks[drinks.length - 1].startTime.getTime());

  drinks.forEach(drink => {
    const current = new Date(drink.startTime.getTime());
    if (current < firstDot) {
      firstDot = current;
    }
    if (lastDot < current) {
      lastDot = current;
    }
  });
  lastDot.setHours(lastDot.getHours() + 2);
  return [firstDot, lastDot];
}


/**
 * No clue what this does.
 * @param drinks - The list of drinks.
 * @param userData - The user's basic data.
 */
function ebacSteps(
  drinks: IDrink[],
  userData: IBasicData,
): {labels: string[]; points: number[]; comeDown: number | null} {
  const labels: string[] = [];
  const points: number[] = [];
  let comeDown = null;

  if (drinks.length === 0) {
    return {labels, points, comeDown};
  }

  const currentTime = new Date();
  const [time, lastDot] = firstAndLastTime(drinks);

  let bac = 0;
  let drinksInPast = [];

  do {
    drinksInPast = drinks.filter(drink => drink.startTime <= time);
    bac = calculateEbac(drinksInPast, time, userData);
    if (time < lastDot) {
      const label = prettyPrintHoursMinutes(time);
      labels.push(label);
      points.push(bac);
    }
    time.setMinutes(time.getMinutes() + 30);
  } while (
    (bac > 0.01 || drinks.length !== drinksInPast.length) &&
    time < currentTime
  );

  if (time > currentTime) {
    const label = prettyPrintHoursMinutes(currentTime);
    bac = calculateEbac(drinks, currentTime, userData);
    labels.push(label);
    points.push(bac);
  } else {
    const label = prettyPrintHoursMinutes(time);
    bac = calculateEbac(drinks, time, userData);
    labels.push(label);
    comeDown = bac;
  }

  return {labels, points, comeDown};
}

function calculateEbac(
  drinks: IDrink[],
  endTime: Date,
  userData: IBasicData,
): number {
  if (drinks.length === 0) {
    return 0;
  }

  let earliestCandidate = drinks[0].startTime.getTime();
  drinks.forEach(drink => {
    if (drink.startTime.getTime() < earliestCandidate) {
      earliestCandidate = drink.startTime.getTime();
    }
  });

  let periodHours = (endTime.getTime() - earliestCandidate) / (1000 * 60 * 60);

  let grams = drinks
    .map(drink => {
      let amount = volumeToCl(drink.volume, drink.unit);
      let alcoholMl = (amount / 10) * drink.percentage;
      return alcoholMl * 0.789;
    })
    .reduce((a, b) => a + b, 0);

  return ebac(grams, periodHours, userData);
}

function ebac(
  alcoholGrams: number,
  periodHours: number,
  userData: IBasicData,
): number {
  if (periodHours < 0) {
    return 0;
  }
  let bw = userData.sex === Sex.Male ? 0.58 : 0.49;
  const weight = weightToKg(userData.weight, userData.weightUnit);
  let result =
    (0.806 * (alcoholGrams / 10) * 1.2) / (bw * weight) - 0.017 * periodHours;
  return result > 0 ? result : 0;
}

export {calculateEbac, ebacSteps};
