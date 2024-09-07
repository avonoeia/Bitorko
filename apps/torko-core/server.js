const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const bodyParser = require('body-parser');

const requireAuth = require('./middlewares/requireAuth')

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/posts')

// express app
app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

// routes
app.use('/api/users', userRoutes)
// All protected routes
app.use(requireAuth)
app.use('/api/posts', postRoutes)

// Connecting to MongoDB database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to db at port:", process.env.PORT);
        });
    })
    .catch((err) => console.log(err));

