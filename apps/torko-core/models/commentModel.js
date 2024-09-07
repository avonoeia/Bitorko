const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");

const commentSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        profile_picture: {
            type: String,
        },
        post_ref: {
            type: String,
            required: true,
            trim: true,
        },
        comment_text_content: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

commentSchema.statics.createComment = async function ({
    username,
    profile_picture,
    post_ref,
    comment_text_content,
}) {
    console.log("Check", username, profile_picture, post_ref, comment_text_content)
    const comment = await this.create({
        username,
        profile_picture,
        post_ref,
        comment_text_content,
    });

    return comment;
}   

module.exports = mongoose.model("Comments", commentSchema);