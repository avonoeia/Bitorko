const { amarDabiQueue } = require('../queues.js');
const processingDelay = 60 * 1000 // Set to one minute for development and testing

async function addToQueue({ documentId }) {
    try {
        await amarDabiQueue.add(
            { documentId },
            {
                delay: processingDelay,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                }
            }
        );
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}


module.exports = addToQueue;