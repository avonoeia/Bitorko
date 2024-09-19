const express = require('express')
const router = express.Router()
const {
    addComment,
    addRemoveUpvote,
    addRemoveDownvote,
    getPost,
    getPosts,
    createPost
} = require('../controllers/postsController')

router.get('/get-posts', getPosts)
router.get('/get-post/:post_id', getPost)
router.post('/add-remove-upvote/:post_id', addRemoveUpvote)
router.post('/add-remove-downvote/:post_id', addRemoveDownvote)
router.post('/create', createPost)
router.post('/add-comment/:post_id', addComment)

module.exports = router