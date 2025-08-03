// const joi = require("joi");

// module.exports.listingScema = joi.object({
//     listing: joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),
//         // image :joi.string().allow("",null)
//         image: joi.object({
//             url: joi.string().allow("",null),
//             filename: joi.string().allow('').default('listingimage')
//         })


//     }).required()
// });

// module.exports.reviewSchema = joi.object({
//     review: joi.object({
//         rating: joi.number().required().min(1).max(5),
//         comment: joi.string().required()
//     }).required()
// })


const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().allow('', null).default('https://images.unsplash.com/photo-1743856842985-e1d4fc72a255?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
            filename: Joi.string().allow('').default('listingimage')
        }).optional()


    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
