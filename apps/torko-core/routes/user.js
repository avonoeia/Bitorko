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
    checkUniqueUsername,
    resetPasswordRequest1,
    resetPasswordRequest2
} = require('../controllers/userController')


router.post('/verification1', userEmailVerification1)
router.post('/verification2', userEmailVerification2)
router.post('/signup', userSignup)
router.post('/login', userLogin)
router.post('/check-unique-username', checkUniqueUsername)

// Reset password routes
router.post('/reset-password1', resetPasswordRequest1) // Initial reset password request
router.post('/reset-password2', resetPasswordRequest2) // Reset password request after email verification

router.use(requireAuth)
router.get('/user-profile/:userRequested', getUserProfile)
router.post('/follow-unfollow/:user_id', followUnfollow)

// router.use(requireAuth)

module.exports = router