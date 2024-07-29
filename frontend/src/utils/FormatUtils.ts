/* eslint-disable import/prefer-default-export */
export const titleCase = (value: string): string => {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
};
