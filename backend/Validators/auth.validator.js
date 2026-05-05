import Joi from "joi";

const validateLogin = (obj) => {
    const Schema = Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
        password: Joi.string().trim().required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty'
        })
    });
    return Schema.validate(obj);
};

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateContact = (obj) => {
    const Schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        message: Joi.string().min(10).max(1000).required()
    });
    return Schema.validate(obj);
};

export {
    validateLogin,
    isValidEmail,
    validateContact
};