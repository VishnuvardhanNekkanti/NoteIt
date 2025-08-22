const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');


const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/mern_notes');

const db = mongoose.connection;
db.on('connected', () => {
	console.log('MongoDB connected successfully');
});
db.on('error', (err) => {
	console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
	console.log('MongoDB disconnected');
});


app.use('/api/notes', noteRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));