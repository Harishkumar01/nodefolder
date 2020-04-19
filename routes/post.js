const express = require('express')
const {getPosts,createPost,postsByUser,postById,isPoster,updatePost,deletePost,photo,singlePost,like,unlike,comment,uncomment} = require('../Controllers/post')
const { requireSignin } = require('../Controllers/auth')
const { userById } = require('../Controllers/user')
const {createPostvalidator} = require('../validators')

const router = express.Router();

router.get('/posts', getPosts);
// like unlike
router.put('/post/like',requireSignin,like)
router.put('/post/unlike',requireSignin,unlike)

//commments
router.put('/post/comment',requireSignin,comment)
router.put('/post/uncomment',requireSignin,uncomment)

router.post('/post/new/:userId',requireSignin, createPost, createPostvalidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);
//photo
router.get('/post/photo/:postId',photo )


// any routes containing  userId ,our app will first execute userById() 
router.param("userId", userById);

// any routes containing  postId ,our app will first execute postById() 
router.param("postId", postById);


module.exports = router;

