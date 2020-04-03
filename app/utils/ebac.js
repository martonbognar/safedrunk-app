import { UNITS } from '../data/units';

function getDots(drinks) {
    let time = new Date(drinks[0].startTime.getTime());
    let lastDot = new Date(drinks[drinks.length - 1].startTime.getTime());
    drinks.forEach((drink) => {
      const current = new Date(drink.startTime.getTime());
      if (current < time) {
        time = current;
      }
      if (lastDot < current) {
        lastDot = current;
      }
    });
    lastDot.setHours(lastDot.getHours() + 2);
    return {first: time, last: lastDot};
  }

function ebacSteps(drinks, userData) {
    const data = {
        output: [],
        comeDown: [],
    };

    if (drinks.length === 0) {
        return data;
    }

    const currentTime = new Date();
    const dots = getDots(drinks);
    const time = dots['first'];
    const lastDot = dots['last'];

    let bac = 0;
    let consideredDrinks = [];

    do {
        consideredDrinks = drinks.filter((drink) => drink.startTime <= time);
        bac = calculateEbac(consideredDrinks, time, userData);
        if (time < lastDot) {
            const label = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2);
            data['output'].push({ [label]: bac });
        }
        time.setMinutes(time.getMinutes() + 30);
    } while ((bac > 0.01 || drinks.length !== consideredDrinks.length) && time < currentTime);

    if (time > currentTime) {
        const label = ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2);
        bac = calculateEbac(drinks, currentTime, userData);
        data['output'].push({ [label]: bac });
    } else {
        const label = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2);
        data['comeDown'].push(data['output'][data['output'].length - 1]);
        bac = calculateEbac(drinks, time, userData);
        data['comeDown'].push({ [label]: bac });
    }

    return data;
}

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

export { calculateEbac, ebacSteps };
