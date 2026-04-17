
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI); // add this line
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serves index.html

// ── Connect to MongoDB Atlas ──────────────────────
mongoose.connect("mongodb://Cloudedu:cloudedu984@ac-1unzusa-shard-00-00.ajglhro.mongodb.net:27017,ac-1unzusa-shard-00-01.ajglhro.mongodb.net:27017,ac-1unzusa-shard-00-02.ajglhro.mongodb.net:27017/?ssl=true&replicaSet=atlas-y25ryd-shard-0&authSource=admin&appName=Edu-cluster")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── Schemas ───────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  role:     { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },
  createdAt:{ type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  subject:  { type: String, required: true },
  type:     { type: String, enum: ['PDF', 'Notes', 'Video', 'Code'], required: true },
  url:      { type: String },
  uploadedBy: { type: String },
  createdAt:{ type: Date, default: Date.now }
});

const User     = mongoose.model('User', userSchema);
const Resource = mongoose.model('Resource', resourceSchema);

// ── User Routes ───────────────────────────────────
// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Resource Routes ───────────────────────────────
// Get all resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a resource
app.post('/api/resources', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a resource
app.delete('/api/resources/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.send('OK'));

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));