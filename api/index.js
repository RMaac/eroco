const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('DB Error:', err));
}

// Schemas & Models
const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, default: 'You' },
  tracksCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: 'Unknown Artist' },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Library = mongoose.models.Library || mongoose.model('Library', librarySchema);
const Track = mongoose.models.Track || mongoose.model('Track', trackSchema);

// API Endpoints

// 1. Get All Libraries
app.get('/api/libraries', async (req, res) => {
  try {
    const libraries = await Library.find().sort({ createdAt: -1 });
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch libraries' });
  }
});

// 2. Create New Library
app.post('/api/libraries', async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const newLib = new Library({ name, isPublic });
    await newLib.save();
    res.status(201).json(newLib);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create library' });
  }
});

// 3. Get All Tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// 4. Save Track Metadata
app.post('/api/tracks', async (req, res) => {
  try {
    const { title, artist, fileUrl } = req.body;
    const newTrack = new Track({ title, artist, fileUrl });
    await newTrack.save();
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save track' });
  }
});

module.exports = app;
