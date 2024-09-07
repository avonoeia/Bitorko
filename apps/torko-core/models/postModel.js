const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");

const postSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        author_name: {
            type: String,
            required: true,
            trim: true,
        },
        post_title: {
            type: String,
            trim: true,
        },
        post_text_content: {
            type: String,
            trim: true,
        },
        post_image_content: {
            type: String,
        },
        topic: {
            type: String,
            trim: true,
        },
        likes: {
            type: Array,
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

postSchema.statics.createPost = async function ({
    username,
    author_name,
    post_title,
    post_text_content,
    post_image_content,
    topic,
    likes,
}) {
    const post = await this.create({
        post_id,
        username,
        author_name,
        post_title,
        post_text_content,
        post_image_content,
        topic,
        likes,
    });

    return post;
};

postSchema.statics.deletePost = async function ({ post_id }) {
    const post = await this.findOneAndDelete({ post_id });

    return post;
};


module.exports = mongoose.model("Posts", postSchema);
