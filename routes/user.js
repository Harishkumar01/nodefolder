const express = require('express')
const { userById,allUsers,getUser,UserUpdate,deleteUser,userPhoto,addFollowing,addFollower,removeFollowing,removeFollower,findPeople } = require('../Controllers/user')
const { requireSignin } = require('../Controllers/auth')

const router = express.Router();


router.put('/user/follow',requireSignin,addFollowing,addFollower)
router.put('/user/unfollow',requireSignin,removeFollowing,removeFollower)

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, UserUpdate);
router.delete('/user/:userId', requireSignin, deleteUser);
//photo
router.get('/user/photo/:userId',userPhoto )
//who to follow
router.get('/user/findpeople/:userId',requireSignin, findPeople)


// any routes containing  userId ,our app will first execute userById() 
router.param("userId", userById);



module.exports = router;



