const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_REGEX = 'REGEX';
const VALIDATOR_TYPE_CUSTOM = 'CUSTOM';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val
});
export const VALIDATOR_MIN = (val) => ({
  type: VALIDATOR_TYPE_MIN,
  val
});
export const VALIDATOR_MAX = (val) => ({
  type: VALIDATOR_TYPE_MAX,
  val
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.toString().trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.toString().trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.toString().trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && parseFloat(value) >= parseFloat(validator.val);
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && parseFloat(value) <= parseFloat(validator.val);
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_REGEX) {
      const re = new RegExp(validator.val, 'g');
      isValid = isValid && re.exec(value);
    }
    if (validator.type === VALIDATOR_TYPE_CUSTOM) {
      isValid = isValid && validator.isValid;
    }
  }

  return isValid;
};
