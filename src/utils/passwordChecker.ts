const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

export const isValidPassword = (password: string): boolean => {
  return passwordRegex.test(password);
}; // true or false based on the password validity
