export const validatePhoneNumber = (value: string): string | null => {
  const phoneNumberRegex = /^\d+$/;
  return phoneNumberRegex.test(value) ? null : "Invalid number";
};

export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : "Invalid address";
};

export const validatePassword = (value: string): string | null => {
  const letterRegex = /[a-zA-Z]/;
  const numberRegex = /[0-9]/;

  if (
    value.length < 8 ||
    !letterRegex.test(value) ||
    !numberRegex.test(value)
  ) {
    return "Password must contain at least 1 letter, 1 number, and be at least 8 characters long";
  }

  return null;
};
