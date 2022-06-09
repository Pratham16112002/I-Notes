const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchUser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator')

// Route 1 : get all the notes  using a get request .(login required)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internel Server error")
    }

})
// Route 2 : Add a new note using post . (login required)
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter the description here , atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        // IF there is validation error then , return Bad request and the error.
        const { title, description, tag } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error!")
    }

})
// Route 3 : Update the existing notes . (Login required)
// Rememeber this is async method.
router.patch('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        // Create a newnote object
        const newNote = {};
        // Below if the use has given the following details then we would update then otherwise we will leave it.
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        // Finding the note and updating it.
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
// Route 4 : Deleting the note . (Login required)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Finding the note and deleting it
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        // Allow deletion only if it belong to the valid user.
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Successfully deleted to note.", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

module.exports = router 