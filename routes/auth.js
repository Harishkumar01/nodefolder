const express = require('express')
const { signup,signin,signout,forgotPassword,resetPassword,socialLogin } = require('../Controllers/auth')
const { userById } = require('../Controllers/user')
const {userSignupValidator,passwordResetValidator} = require('../validators')

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

//password forgot and reset routes
router.put("/forgot-password",forgotPassword)
router.put("/reset-password",passwordResetValidator, resetPassword)
router.post("/social-login",socialLogin)

// any routes containing  userId ,our app will first execute userById() 
router.param("userId", userById);

module.exports = router;



