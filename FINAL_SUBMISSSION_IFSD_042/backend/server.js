require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({message: 'AI Interview Backend running'}));

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.warn('Warning: MONGO_URI not defined in .env. Some features will be disabled.');
} else {
  mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.error('MongoDB connection error:', err.message));
}

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));