const express = require('express')
const router = express.Router()
const {
    addComment,
    addRemoveLike,
    getPost,
    getPosts,
    createPost
} = require('../controllers/postsController')

router.get('/get-posts', getPosts)
router.get('/get-post/:post_id', getPost)
router.post('/add-remove-like/:post_id', addRemoveLike)
router.post('/create', createPost)
router.post('/add-comment/:post_id', addComment)

module.exports = router