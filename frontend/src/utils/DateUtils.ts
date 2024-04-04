// Get date of currentDate + daysToAdd (if unspecified, defaults to the next day)
// eslint-disable-next-line import/prefer-default-export
export const getNextDays = (currentDate = new Date(), daysToAdd = 1) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);
    return nextDate;
};
