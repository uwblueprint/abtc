/* eslint-disable import/prefer-default-export */
export const titleCase = (value: string): string => {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
};


export const capitalizeName = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
};