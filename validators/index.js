exports.createPostvalidator = (req, res, next) => {

    //title
    req.check('title',"Write a title").notEmpty()
    req.check('title',"Title must be between 4 to 150 characters").isLength({
        min:4,
        max:150
    });

    
    //body
    req.check('title',"Write a body").notEmpty()
    req.check('title',"body must be between 4 to 2000 characters").isLength({
        min:4,
        max:2000
    });

    //check for errors

    const errors = req.validationErrors()
    // if error show the first one as they happen
    if(errors){
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    //proceed to next middleware
    next();

};

exports.userSignupValidator = (req,res,next) => {
    //name is not null and 4 to 20 chars long
    req.check("name","Name is required").notEmpty();
    //email is not null,it is valid and normalized
    req.check("email","Email must be 10 to 50 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @ and .")
    .isLength({
        min: 10,
        max: 50
    })
    //check for password
    req.check("password","Password is Required").notEmpty();
    req.check("password")
    .isLength({min: 6})
    .withMessage("Password must contain minimum 6 chars")
    .matches(/\d/)
    .withMessage("password must contain a number")
    //check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if(errors){
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    //proceed to next middleware
    next();
}

exports.passwordResetValidator = (req,res,next) => {
    //name is not null and 4 to 20 chars long
    req.check("newPassword","Password is required").notEmpty();
    //check for password
    req.check("newPassword")
    .isLength({min: 6})
    .withMessage("Password must contain minimum 6 chars")
    .matches(/\d/)
    .withMessage("password must contain a number")
    //check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if(errors){
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    //proceed to next middleware
    next();
}

