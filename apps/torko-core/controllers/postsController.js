const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
let upload = require("../middlewares/postUploader.js");
const multer = require("multer");
upload = upload.single("post_image_content");

async function createPost(req, res) {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                message: err.message,
            });
        } else if (err) {
            return res.status(400).json({
                message: err.message,
            });
        }

        let {
            username,
            author_name,
            post_title,
            post_text_content,
            post_image_content,
            topic,
            likes,
        } = req.body;

        author_name = req.user.name
    
        try {
            const post = await Post.create({
                username,
                author_name,
                post_title,
                post_text_content,
                post_image_content,
                topic,
                likes,
            });
            
    
            return res.status(201).json(post);
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    });
}

async function getPosts(req, res) {
    const { username } = req.user

    try {
        const posts = await User.getFollowedPosts({ username })

        return res.status(200).json({ posts });
    } catch(error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function getPost(req, res) {
    const { post_id } = req.params;
    // console.log(post_id)

    try {
        const post = await Post.findOne({ _id: post_id })
        const comments = await Comment.find({ post_ref: post_id }).sort({ createdAt: -1 })

        return res.status(200).json({post, comments: comments});
    } catch (err) {
        console.log(err)
    }
}

async function addRemoveLike(req, res) {
    const { post_id } = req.params

    try {
        const post = await Post.findOne({ _id: post_id })

        if (post.likes.find(u => u === req.user.username)) {
            post.likes = post.likes.filter(u => u !== req.user.username)
        } else {
            post.likes.push(req.user.username)
        }

        await post.save()

        return res.status(200).json(post)
    } catch(err) {
        console.log(err)
    }
}

async function addComment(req, res) {
    const { post_id } = req.params
    // console.log("Check",post_id)
    try {
        
        const { username, comment_text_content } = req.body
        const user = User.findOne({ username: username })
        const profile_picture = user.profile_picture

        const comment = await Comment.create({
            username,
            comment_text_content,
            post_ref: post_id,
            profile_picture
        })

        return res.status(201).json(comment)
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    addComment,
    addRemoveLike,
    getPost,
    getPosts,
    createPost,
};
