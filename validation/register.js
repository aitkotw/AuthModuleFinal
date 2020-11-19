const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  let requiredFields = ['name', 'email', 'password', 'password2']

  requiredFields.forEach(key => {
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  });

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be betveen 2 and 30 char";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be 6 to 30 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  requiredFields.forEach(key => {
    if (Validator.isEmpty(data[key])) {
        errors[key] = `${key} field is required`;
    }
  });

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
