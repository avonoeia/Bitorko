const { MongoClient } = require("mongodb");
const cors = require("cors");
const express = require("express");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(express.json());
app.use(cors());
app.use(requireAuth)

app.get("/search", async (req, res) => {
    const userQuery = req.query.query;

    if (!userQuery || userQuery.length < 2) {
        res.json([]);
        return;
    }

    const db = client.db("test");
    let collection = db.collection("users");

    const userSearchPipeline = [];
    const postSearchPipeline = [];

    userSearchPipeline.push({
        $search: {
            index: "searchUsers",
            text: {
                query: userQuery,
                path: ["username", "name", "email"],
                fuzzy: {},
            },
        },
    });

    userSearchPipeline.push({
        $project: {
            _id: 1,
            score: { $meta: "searchScore" },
            name: 1,
            email: 1,
            username: 1,
            profile_picture: 1,
            createdAt: 1,
        },
    });

    const userSearchResult = await collection
        .aggregate(userSearchPipeline)
        .sort({ score: -1 })
        .limit(10);
    const UserResults = await userSearchResult.toArray();

    collection = db.collection("posts");

    postSearchPipeline.push({
        $search: {
            index: "searchPosts",
            text: {
                query: userQuery,
                path: ["username", "author_name", "post_text_content"],
                fuzzy: {},
            },
        },
    });

    postSearchPipeline.push({
        $project: {
            score: { $meta: "searchScore" },
            _id: 1,
            username: 1,
            author_name: 1,
            post_text_content: 1,
            post_image_content: 1,
            likes: 1,
            upvotes: 1,
            downvotes: 1,
            createdAt: 1,
        },
    });

    const postSearch = await collection
        .aggregate(postSearchPipeline)
        .sort({ score: -1 })
        .limit(10);
    const postResults= await postSearch.toArray();

    res.json({ UserResults, postResults});
});

app.listen(4001, () => {
    console.log("Server is running on port 4001");
});
