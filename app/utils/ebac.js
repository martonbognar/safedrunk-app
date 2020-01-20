import { UNITS } from '../data/units';

function calculateEbac(drinks, endTime, userData) {
    if (drinks.length === 0) {
        return 0;
    }

    let earliest = drinks[0].startTime.getTime();
    drinks.forEach((drink) => {
        if (drink.startTime.getTime() < earliest) {
            earliest = drink.startTime.getTime();
        }
    });

    let period = (endTime.getTime() - earliest) / (1000 * 60 * 60);

    let grams = drinks.map(drink => {
        let amount = UNITS[drink.unit]['multiplier'] * drink.amount;
        let alcoholml = (amount / 10) * drink.percentage;
        return alcoholml * 0.789;
    }).reduce((a, b) => a + b, 0);

    return ebac(grams, period, userData).toFixed(5);
}

function ebac(alcohol, period, userData) {
    if (period < 0) {
        return 0;
    }
    let bw = userData.sex === 'male' ? 0.58 : 0.49;
    let result = ((0.806 * (alcohol / 10) * 1.2) / (bw * userData.weight)) - (0.017 * period);
    return result > 0 ? result : 0;
}

export { calculateEbac };
