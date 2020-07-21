function intervalToText(date: Date): string {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (diff < 0) {
    return 'in the future';
  } else if (diff < 10) {
    return 'just now';
  } else if (diff < 60) {
    return diff + ' seconds ago';
  } else if (diff < 120) {
    return 'a minute ago';
  } else if (diff < 60 * 60) {
    return Math.floor(diff / 60) + ' minutes ago';
  } else if (diff < 60 * 60 * 2) {
    return 'an hour ago';
  } else if (diff < 60 * 60 * 24) {
    return Math.floor(diff / (60 * 60)) + ' hours ago';
  } else if (diff < 2 * 60 * 60 * 24) {
    return 'a day ago';
  } else {
    return Math.floor(diff / (60 * 60 * 24)) + ' days ago';
  }
}


/**
 * For a date object, returns the time component as hh:mm.
 */
function prettyPrintHoursMinutes(date: Date): string {
  return (
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2)
  );
}

export {intervalToText, prettyPrintHoursMinutes};
