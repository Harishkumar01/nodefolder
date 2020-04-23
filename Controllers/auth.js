const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')
const expressjwt = require('express-jwt')
const _ = require('lodash')
const {sendEmail} = require('../helpers')


exports.signup = async (req,res) => {
    try{
        const userExists = await User.findOne({ email: req.body.email })
        if(userExists)
            return res.status(403).json({
                error: "Email is taken!"
            });
        const user = await new User(req.body)
        await user.save()
        res.status(200).json({ message: "Signup sucessfull please login" })
    }
    catch(error){
        console.log(`That did not go well: ${error}`);

    }

};

exports.signin = (req,res) => {
    //find the user based on email
    const {email,password} = req.body
    User.findOne({email},(err,user) =>  {
        //if err or no user
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email not found.Please Signup"
            })
        }
        //if user found check email and password match
        //create authenticate method in model and use here 
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match here"
            })

        }
        
        //generate a userid and secret
        const token = jwt.sign({_id: user._id}, process.env.jwt_secret);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999});

        //return response with user and token to frontend client
        const {_id,name,email} = user
        return res.json({token, user: {_id,name,email} })


    })


};

exports.signout = (req,res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success!" });
}

exports.requireSignin = expressjwt({
    //if the token is valid ,express jwt appends the verified users id in an
    // auth key to the request object
    secret: process.env.jwt_secret,
    userProperty: "auth"


})

//forgotpassword and resetpassword methods

exports.forgotPassword = (req,res) => {
    console.log("hi")
    if (!req.body) return res.status(400).json({message: "No request body"})
    if (!req.body.email) return res.status(400).json({message: "No email in request body"})

    console.log("Forgot password finding user with that email")
    const {email} = req.body
    console.log(email)
    User.findOne({email},(err,user) => {
        if(err || !user) {
            return res.status("401").json({
                error:"User with that email does not exist!"
            })
        }
        console.log(user)
        const token = jwt.sign(
            {_id:user._id,iss:"NODEFOLDER"},
            process.env.jwt_secret
        )
        //email data
        const emailData = {
            from: 'noreply@node-react.com',
            to: email,
            subject: 'Password Reset Instructions',
            text: `Please use the following link to reset your password: http://139.59.43.98:3000/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>http://139.59.43.98:3000/reset-password/${token}</p>`
        }
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                })
            }
        })
        
    })
}

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    console.log(req.body)
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'Invalid Link!'
            });

        console.log(user)

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ''
        };


        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(user)
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};

exports.socialLogin = (req, res) => {
     console.log('social login req.body', req.body);

 // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
     if (err || !user) {
         // create a new user and login
         user = new User(req.body);
         req.profile = user;
         user.save();
         // generate a token with user id and secret
         const token = jwt.sign({ _id: user._id, iss: "NODEFOLDER" }, process.env.JWT_SECRET);
         res.cookie('t', token, { expire: new Date() + 9999 });
         // return response with user and token to frontend client
         const { _id, name, email } = user;
         return res.json({ token, user: { _id, name, email } });
        } else {
         // update existing user with new social info and login
         req.profile = user;
         user = _.extend(user, req.body);
         user.updated = Date.now();
         user.save();
         // generate a token with user id and secret
         const token = jwt.sign({ _id: user._id, iss: "NODEFOLDER" }, process.env.JWT_SECRET);
         res.cookie('t', token, { expire: new Date() + 9999 });
         // return response with user and token to frontend client
         const { _id, name, email } = user;
         return res.json({ token, user: { _id, name, email } });
     }
 });
 };


