const { check, validationResult } = require("express-validator");

module.exports = {
 validateLogin :[
        check('password').not().isEmpty().isLength({min: 6, max: 100}),
        check('email').not().isEmpty().isEmail().isLength({max: 100})
        , (req, res, next) => {
            console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log(errors.array());
            return res.status(422).json({ errors: errors.array() });
        }
        else next();
    }]
    
};
