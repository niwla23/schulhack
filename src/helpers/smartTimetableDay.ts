export const smartTimetableDay = (currentDate: Date): number => {
  let shouldUseNextDay = false;
  if (currentDate.getUTCHours() >= 18) {
    shouldUseNextDay = true;
  }
  if (currentDate.getUTCDay() >= 6 || currentDate.getUTCDay() === 0) {
    // who thought it is a good idea to make sunday day 0?
    // if we are on a weekend always show table for monday
    return 1;
  }
  if (shouldUseNextDay) {
    // time is after 18:00, showing next day
    if (currentDate.getUTCDay() === 5) {
      // friday evening, also show monday
      return 1;
    } else {
      // mo - fr, after 18:00 show next day
      return currentDate.getUTCDay() + 1;
    }
  }
  return currentDate.getUTCDay();
};

export default smartTimetableDay;
