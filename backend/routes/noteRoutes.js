const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Delete all notes
router.delete('/', async (req, res) => {
	try {
		await Note.deleteMany({});
		res.json({ message: 'All notes deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});


// Create

router.post('/', async (req, res) => {
	try {
		const { title, content, category, isPinned } = req.body;
		const note = new Note({
			title,
			content,
			category: category || 'Personal',
			isPinned: isPinned || false
		});
		await note.save();
		res.json(note);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});


// Read
router.get('/', async (req, res) => {
const notes = await Note.find().sort({ createdAt: -1 });
res.json(notes);
});


// Update

router.put('/:id', async (req, res) => {
	try {
		const { title, content, category, isPinned } = req.body;
		const note = await Note.findByIdAndUpdate(
			req.params.id,
			{ title, content, category, isPinned },
			{ new: true }
		);
		res.json(note);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});


// Delete
router.delete('/:id', async (req, res) => {
await Note.findByIdAndDelete(req.params.id);
res.json({ message: 'Note deleted' });
});


module.exports = router;