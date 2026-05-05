import Joi from "joi";

const validateUpdateUserData = (obj) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        bio: Joi.string().optional(),
        skills: Joi.string().optional(),
        description: Joi.string().optional(),
        linkedIn:Joi.string().optional(),
        github:Joi.string().optional(),
        phoneNumber:Joi.string().optional().valid(/^01[0125][0-9]{8}$/),
        city:Joi.string().optional(),
        street:Joi.string().allow("").optional(),
        governorate:Joi.string().optional(),
        freelancePlatforms:Joi.string().optional()
    });
    return schema.validate(obj);
};

const validateCertificateData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        issuer: Joi.string().required(),
        description: Joi.string().optional().allow("",null),
        issueDate: Joi.date().required()
    });
    return schema.validate(obj);
};

const validateExperienceData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        company: Joi.string().required(),
        description: Joi.string().optional(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
        currentlyWorking: Joi.boolean().optional(),
    });
    return schema.validate(obj);
};

const validateProjectData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        liveDemo: Joi.string().optional().allow("").trim(),
        githubLink: Joi.string().optional().allow("").trim(),
        usedSkills:Joi.string().optional(),
    });
    return schema.validate(obj);
};

const validateUpdateProjectData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        liveDemo: Joi.string().optional().allow(""),
        githubLink: Joi.string().optional().allow(""),
        usedSkills:Joi.string().optional(),
    });
    return schema.validate(obj);
};

const validateUpdateExperienceData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().optional(),
        company: Joi.string().optional(),
        description: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional().allow(null),
        currentlyWorking: Joi.boolean().optional(),
    });
    return schema.validate(obj);
};

const validateUpdateCertificateData = (obj) => {
    const schema = Joi.object({
        title: Joi.string().optional(),
        issuer: Joi.string().optional(),
        description: Joi.string().optional(),
        issueDate: Joi.date().optional()
    });
    return schema.validate(obj);
};

export {
    validateUpdateUserData,
    validateCertificateData,
    validateExperienceData,
    validateProjectData,
    validateUpdateProjectData,
    validateUpdateExperienceData,
    validateUpdateCertificateData
};