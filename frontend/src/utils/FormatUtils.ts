/* eslint-disable import/prefer-default-export */
export const titleCase = (value: string): string => {
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phoneString: string) => {
  if (phoneString.length !== 10) {
    return phoneString;
  }

  const areaCode = phoneString.slice(0, 3);
  const middle = phoneString.slice(3, 6);
  const last = phoneString.slice(6);

  return `(${areaCode}) ${middle}-${last}`;
};
