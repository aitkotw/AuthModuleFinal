const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateVendorDetails = (data) => {
    let errors = {};
    let requiredFields = ['name', 'email', 'phone', 'dbname']

    requiredFields.forEach(key => {
        data[key] = !isEmpty(data[key]) ? data[key] : "";
    });

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
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
}

module.exports = validateVendorDetails