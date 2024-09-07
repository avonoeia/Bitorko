const express = require('express')
const router = express.Router()
const requireAuth = require('../middlewares/requireAuth')
const {
    followUnfollow,
    getUserProfile,
    userEmailVerification1,
    userEmailVerification2,
    userSignup,
    userLogin,
    checkUniqueUsername
} = require('../controllers/userController')


router.post('/verification1', userEmailVerification1)
router.post('/verification2', userEmailVerification2)
router.post('/signup', userSignup)
router.post('/login', userLogin)
router.post('/check-unique-username', checkUniqueUsername)

router.use(requireAuth)
router.get('/user-profile/:userRequested', getUserProfile)
router.post('/follow-unfollow/:user_id', followUnfollow)

// router.use(requireAuth)

module.exports = router