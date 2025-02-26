require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const ProfileSchema = new mongoose.Schema({
    title: String,
    post: String
});

const Profile = mongoose.model("Profile", ProfileSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Route - Show all posts
app.get('/', async (req, res) => {
    let results = await Profile.find({});
    res.render('profile', { profileData: results });
});

// Insert a new post
app.post('/insert', async (req, res) => {
    await Profile.create({ title: req.body.title, post: req.body.post });
    res.redirect('/');
});

// Update a post
app.post('/update', async (req, res) => {
    await Profile.findByIdAndUpdate(req.body.updateId, {
        title: req.body.updateTitle,
        post: req.body.updatePost
    });
    res.redirect('/');
});

// Delete a post
app.post('/delete', async (req, res) => {
    await Profile.findByIdAndDelete(req.body.deleteId);
    res.redirect('/');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
