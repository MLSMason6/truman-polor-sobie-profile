const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Initialize MongoDB Connection
let db, mongoCollection;
async function connectDB() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    db = client.db('masonSobieProfile');
    mongoCollection = db.collection('masonSobieBlog');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}
connectDB();

// Routes
app.get('/', async (req, res) => {
  try {
    let results = await mongoCollection.find({}).toArray();
    res.render('profile', { profileData: results });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/insert', async (req, res) => {
  try {
    let { title, post } = req.body;
    if (!title || !post) {
      return res.status(400).send('Title and Post are required.');
    }
    await mongoCollection.insertOne({ title, post });
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/delete', async (req, res) => {
  try {
    let deleteId = req.body.deleteId;
    if (!ObjectId.isValid(deleteId)) {
      return res.status(400).send('Invalid ID');
    }
    await mongoCollection.deleteOne({ _id: new ObjectId(deleteId) });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/update', async (req, res) => {
  try {
    let { updateId, updateTitle, updatePost } = req.body;
    if (!ObjectId.isValid(updateId)) {
      return res.status(400).send('Invalid ID');
    }
    await mongoCollection.updateOne(
      { _id: new ObjectId(updateId) },
      { $set: { title: updateTitle, post: updatePost } }
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
