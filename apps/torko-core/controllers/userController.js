const User = require("../models/userModel");
const Posts = require("../models/postModel");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const { sendVerificationEmail } = require("../helpers/sendValidationCode");

// Utility function that returns a token
function createToken(id) {
    return jwt.sign({ id }, process.env.SECRET);
}
// Utility function checks valid BracU email
function isValidBracUEmail(email) {
    console.log(email)
    return email.endsWith("@g.bracu.ac.bd");
}

async function checkUniqueUsername(req, res) {
    let { username } = req.body

    const flag = await User.findOne({"username": username})

    if (!flag) return res.status(200).json({message: "Username not taken"})

    return res.status(400).json({error: "Username already taken"})
}

// Handles user email verification step 1
async function userEmailVerification1(req, res) {
    let { email } = req.body;

    email = email.toLowerCase();
    if (isValidBracUEmail(email) === false) {
        return res
            .status(400)
            .json({ error: "Please use a valid BracU email." });
    }

    const client = createClient();
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client
        .connect()
        .then(async () => {
            console.log("Connected to Redis");
        })
        .catch((err) => console.log(err));

    try {
        // Send welcome email to the user
        const code = await sendVerificationEmail(email);

        // Error sending email
        if (code === false)
            return res
                .status(500)
                .json({ error: "Error sending email. Please try again." });

        // Save the code in Redis
        await client.set(`verification_${email}`, `${code}`, { EX: 120 });

        return res.status(200).json({
            message: `We've sent an email to ${email} with your verifation code.`,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
}

// Handles user email verification step 2
async function userEmailVerification2(req, res) {
    let { email, code } = req.body;
    email = email.toLowerCase();

    const client = createClient();
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client
        .connect()
        .then(async () => {
            console.log("Connected to Redis");
        })
        .catch((err) => console.log(err));

    try {
        // Get the code from Redis
        const verificationCode = await client.get(`verification_${email}`);

        if (verificationCode == null)
            return res.status(400).json({
                error: "Verification code may have expired. Please request a new one.",
            });
        
        // Check if the code is correct
        if (verificationCode === code) {
            // Create a new entry in Redis
            await client.set(`verified_${email}`, "true", { EX: 1200 });
            // Create temporary token
            const token = createToken(email);
            return res.status(200).json({
                message: "User verification successful. Finish signup within 20 minutes.",
                temporaryToken: token,
            });
        } else {
            return res
                .status(400)
                .json({ error: "Invalid verification code." });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
}

async function verifyBeforeSignup(req, res) {
    const { authorization } = req.headers;
    const client = createClient();
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client
        .connect()
        .then(async () => {
            console.log("Connected to Redis");
        })
        .catch((err) => console.log(err));

    if (!authorization) {
        return res
            .status(401)
            .json({ error: "Access denied. Please verify your email first." });
    }

    const token = authorization.split(" ")[1];
    try {
        const { id } = jwt.verify(token, process.env.SECRET);
        let email = id
        const isVerified = await client.get(`verified_${email}`);
        if (isVerified === null)
            return res.status(400).json({
                error: "Your email is unverified or verification may have expired. Please verify your email first.",
            });
        client.del(`verified_${email}`);
        return true;
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "Invalid authentication token. Access denied.",
        });
    }
}

// Handles user signup, i.e create the user document in db
async function userSignup(req, res) {
    const { email } = req.body;

    const isVerified = await verifyBeforeSignup(req, res);


    if (isVerified !== true) {
        return res.status(400).json({ error: "Please verify your email first." });
    }

    try {
        const user = await User.signup(req.body);

        const token = createToken(user._id);
        return res.status(200).json({ "message": "Signup successful. Welcome to Prangon!", token });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
}

// Handling login request from an existing user
async function userLogin(req, res) {
    const { email, password } = req.body;

    console.log("Hit registered at userLogin controller");
    console.log(email)
    try {
        const user = await User.login(email, password);

        const token = createToken(user._id, "30d");

        res.status(200).json({ username: user.username, token });
    } catch (err) {
        // console.log(err);
        res.status(401).json({ error: err.message });
    }
}

async function getUserProfile(req, res) {
    const { username } = req.user
    const { userRequested } = req.params

    try {
        const requestee = await User.findOne({ username: username })

        const userRequestedData = await User.findOne({ username: userRequested })
        // console.log(userRequestedData)
        
        const posts = await Posts.find({ username: userRequested })
        

        const isFollowing = requestee.following.includes(userRequestedData.username) 

        if (!userRequested) return res.status(400).json({error: "User not found"})

        return res.status(200).json({user: userRequestedData, posts, isFollowing})
    } catch (err) {
        return res.status(400).json({error: err.message})
    }
}

async function followUnfollow(req, res) {
    const { username } = req.user
    const { user_id } = req.params
    console.log(req.params)
    try {
        let user = await User.findOne({ username: username })
        user.following = user.following.includes(user_id) ? user.following.filter(u => u !== user_id) : [...user.following, user_id]
        await user.save()
        return res.status(200).json({message: "Follow/Unfollow successful"})
    } catch (e) {
        return res.status(400).json({error: e.message})
    }
}

module.exports = {
    followUnfollow,
    getUserProfile,
    userEmailVerification1,
    userEmailVerification2,
    userSignup,
    userLogin,
    checkUniqueUsername,
};
