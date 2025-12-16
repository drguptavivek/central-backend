// Password policy for vg app-user auth.
const policy = {
  minLength: 10,
  special: /[~!@#$%^&*()_+\-=,.]/,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  digit: /[0-9]/
};

const validateVgPassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length >= policy.minLength
    && policy.special.test(password)
    && policy.upper.test(password)
    && policy.lower.test(password)
    && policy.digit.test(password);
};

module.exports = { validateVgPassword, policy };
