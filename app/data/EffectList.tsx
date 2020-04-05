enum IntoxicationLevel {
  Subtle,
  Joyousness,
  Extroversion,
  Boisterousness,
  Vomiting,
  Stupor,
  Coma,
}

function getIntoxicationLevel(ebac: number): IntoxicationLevel {
  if (ebac <= 0.03) {
    return IntoxicationLevel.Subtle;
  } else if (ebac <= 0.06) {
    return IntoxicationLevel.Joyousness;
  } else if (ebac <= 0.1) {
    return IntoxicationLevel.Extroversion;
  } else if (ebac <= 0.2) {
    return IntoxicationLevel.Boisterousness;
  } else if (ebac <= 0.3) {
    return IntoxicationLevel.Vomiting;
  } else if (ebac <= 0.4) {
    return IntoxicationLevel.Stupor;
  } else {
    return IntoxicationLevel.Coma;
  }
}

function getBehaviorForIntoxication(level: IntoxicationLevel): string[] {
  switch (level) {
    case IntoxicationLevel.Subtle:
      return ['Average individual appears normal'];
    case IntoxicationLevel.Joyousness:
      return [
        'Mild euphoria',
        'Relaxation',
        'Joyousness',
        'Talkativeness',
        'Decreased inhibition',
      ];
    case IntoxicationLevel.Extroversion:
      return [
        'Blunted feelings',
        'Reduced sensitivity to pain',
        'Euphoria',
        'Disinhibition',
        'Extroversion',
      ];
    case IntoxicationLevel.Boisterousness:
      return [
        'Over-expression',
        'Boisterousness',
        'Possibility of nausea and vomiting',
      ];
    case IntoxicationLevel.Vomiting:
      return [
        'Nausea',
        'Vomiting',
        'Emotional swings',
        'Anger or sadness',
        'Partial loss of understanding',
        'Impaired sensations',
        'Decreased libido',
        'Possibility of stupor',
      ];
    case IntoxicationLevel.Stupor:
      return [
        'Stupor',
        'Central nervous system depression',
        'Loss of understanding',
        'Lapses in and out of consciousness',
        'Low possibility of death',
      ];
    case IntoxicationLevel.Coma:
      return [
        'Severe central nervous system depression',
        'Coma',
        'Possibility of death',
      ];
  }
}

function getImpairmentForIntoxication(level: IntoxicationLevel): string[] {
  switch (level) {
    case IntoxicationLevel.Subtle:
      return ['Subtle effects that can be detected with special tests'];
    case IntoxicationLevel.Joyousness:
      return ['Concentration'];
    case IntoxicationLevel.Extroversion:
      return [
        'Reasoning',
        'Depth perception',
        'Peripheral vision',
        'Glare recovery',
      ];
    case IntoxicationLevel.Boisterousness:
      return [
        'Reflexes',
        'Reaction time',
        'Gross motor control',
        'Staggering',
        'Slurred speech',
        'Temporary erectile dysfunction',
      ];
    case IntoxicationLevel.Vomiting:
      return [
        'Severe motor impairment',
        'Loss of consciousness',
        'Memory blackout',
      ];
    case IntoxicationLevel.Stupor:
      return ['Bladder function', 'Breathing', 'Dysequilibrium', 'Heart rate'];
    case IntoxicationLevel.Coma:
      return ['Breathing', 'Heart rate', 'Positional alcohol nystagmus'];
  }
}

export {
  IntoxicationLevel,
  getIntoxicationLevel,
  getBehaviorForIntoxication,
  getImpairmentForIntoxication,
};
