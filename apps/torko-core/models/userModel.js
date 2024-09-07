const validator = require('validator')
const bcrypt = require('bcrypt')

mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    personal_email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profile_picture: {
        type: String,
        default: '/assets/profile-pictures/default.jpg'
    },
    about: {
        type: String,
        default: 'Hey there! I am using Bitorko.'
    },
    invited_by: {
        type: String,
        default: 'None'
    },
    user_type: {
        type: String,
        default: 'Default'
    },
    department: {
        type: String,
        default: 'Unknown'
    },
    program: {
        type: String,
        default: 'Unknown'
    },
    student_id: {
        type: String,
        default: 'Unknown'
    },
    enrollment_year: {
        type: String,
        default: 'Uknown'
    },
    rs_semester: {
        type: String,
        default: 'Unknown'
    },
    courses_completed: {
        type: Array,
        default: []
    },
    courses_in_progress: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})


userSchema.statics.signup = async function (reqBody) {
    const { email, password } = reqBody
    
    if (!email || !password) {
        throw Error('All fields are required.')
    }
    
    if (!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    if (password.length < 6) {
        throw Error('Password must be 7 characters or greater')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ ...reqBody, password: hash})
    return user
}

userSchema.statics.login = async function (email, password) {
        
    if (!email || !password) {
        throw Error('All fields are required')
    }

    if (!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Account with email does not exist')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}


userSchema.statics.resetPassword = async function (email, newPassword) {
    if (!email || !newPassword) {
        throw Error('All fields are required')
    }

    if (!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    try {
        const user = await this.findOne({ email })

        if (!user) {
            throw Error('Account with email does not exist')
        }

        // Hash and update the password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        user.password = hash
        updatedUser = await user.save()

        return user
    } catch (error) {
        throw Error(`${error.name}: ${error.message}`)
    }
}



userSchema.statics.getFollowedPosts = async function(currentUser) {
    const pipeline = [
        {
          $match: { username: currentUser.username }, // Match the current use
        },
        {
            $addFields: { following: { $concatArrays: ['$following', [currentUser.username] ] } }
        },
        {
          $unwind: '$following', // Unwind the following array
        },
        {
          $lookup: {
            from: 'posts', // Lookup in the posts collection
            localField: 'following', // Match username in following with author field in posts
            foreignField: 'username', // Field in posts collection storing the author username
            as: 'followedPosts', // Name for the joined posts array
          },
        },
        {
          $unwind: '$followedPosts', // Unwind the joined posts array (might be empty for some users)
        },
        {
          $match: { 'followedPosts.deleted': { $ne: true } }, // Filter out deleted posts (optional)
        },
        {
          $sort: { 'followedPosts.createdAt': -1 }, // Sort by createdAt descending
        },
        {
          $project: { followedPosts: 1  }, // Remove unnecessary fields
        },
        {
          $limit: 100, // Limit the final results to 100 documents
        },
      ];
    
      // 3. Execute the aggregation pipeline
      const results = await this.aggregate(pipeline);
    
      // 4. Extract the posts array from each result document
      const followedPosts = results.map((result) => result.followedPosts);
    
      // 5. Flatten the array of arrays (optional, if you want all posts in a single array)
      return [].concat(...followedPosts);
    
  };


module.exports = mongoose.model('User', userSchema)