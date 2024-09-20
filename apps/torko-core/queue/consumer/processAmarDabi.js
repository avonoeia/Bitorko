const Mongoose = require('mongoose');
const Post = require('../../models/postModel');
const { amarDabiQueue, amaderDabiQueue } = require('../queues'); 
const processingDelay = 60 * 1000 // Set to one minute for development and testing

async function processAmarDabi(job) {
    const { documentId } = job.data;
    console.log("Processing AmarDabi with id", documentId, process.env.MONGO_URI)
    const db = await Mongoose.connect(process.env.MONGO_URI)
    try {
        const post = await Post.findOne({ _id: documentId })
        
        upvoteCount = post.upvotes.length;
        downvoteCount = post.downvotes.length;
        totalVotes = upvoteCount + downvoteCount
        
        // Upvote threshold set to 1 to demonstrate purposes
        if (upvoteCount >= 1 && upvoteCount / totalVotes >= 0.5) {
            post.dabi_stage = 'AmaderDabi'
            amaderDabiQueue.add({ documentId: post._id })
            amaderDabiQueue.add(
                { documentId: post._id },
                {
                    delay: processingDelay,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000
                    }
                }
            )
        } else {
            post.dabi_stage = 'Archived'
            post.dabi_status = 'Rejected by star users'
        }

        post.save()
        console.log("Post saved")
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

console.log("Started processing AmarDabi")
amarDabiQueue.process(processAmarDabi);

module.exports = processAmarDabi;