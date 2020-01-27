const Joi = require('@hapi/joi');

const registerValidation = (userData) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi
            .string()
            .min(6)
            .required()
    });
    return schema.validate(userData);
};

const loginValidation = (userData) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi
            .string()
            .min(6)
            .required()
    });
    return schema.validate(userData);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
