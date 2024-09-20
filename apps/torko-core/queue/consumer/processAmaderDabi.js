const Mongoose = require('mongoose');
const Post = require('../../models/postModel');
const { amaderDabiQueue } = require('../queues');

async function processAmaderDabi(job) {
    const { documentId } = job.data
    console.log("Processing AmaderDabi with id", documentId)
    const db = await Mongoose.connect(process.env.MONGO_URI)
    try {
        const post = await Post.findOne({ _id: documentId })
        
        upvoteCount = post.upvotes.length;
        downvoteCount = post.downvotes.length;
        totalVotes = upvoteCount + downvoteCount
        
        // Upvote threshold set to 1 to demonstrate purposes
        if (upvoteCount >= 1 && upvoteCount / totalVotes >= 0.5) {
            post.dabi_stage = 'ShobarDabi'
            
        } else {
            post.dabi_stage = 'Archived'
            post.dabi_status = 'Rejected by community'
        }

        post.save()
        console.log("Post saved")
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

console.log("Started processing AmaderDabi")
amaderDabiQueue.process(processAmaderDabi);

module.exports = processAmaderDabi;