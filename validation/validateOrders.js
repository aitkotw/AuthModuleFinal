const Validator = require("validator");
const isEmpty = require("./is-empty");

const ordersValidator = (data, expectedBodyData, requiredFields) => {
    let errors = {};
    let requiredItems = ['product', 'name', 'hsn', 'qty', 'warranty', 'amt']
    //Verify Main Data fields
    expectedBodyData.forEach(key => {
        data[key] = !isEmpty(data[key]) ? data[key] : "";
    });
    
    //Verify each order items 
    if('items' in data && data.items !== ''){
        data.items.forEach(itemObj => {
            requiredItems.forEach(key => {
                itemObj[key] = !isEmpty(itemObj[key]) ? itemObj[key] : "";
            });
            requiredItems.forEach(key => {
                if (Validator.isEmpty(itemObj[key])) {
                    errors[key] = `${key} field is required`;
                }
            });
        });
    } else {
        errors.items = `Items field is required`;
    }
    

    requiredFields.forEach(key => {
        if (Validator.isEmpty(data[key])) {
            errors[key] = `${key} field is required`;
        }
    });
    console.log(data)
    
    return {
        errors,
        isValid: isEmpty(errors),
    };
}

module.exports = ordersValidator
