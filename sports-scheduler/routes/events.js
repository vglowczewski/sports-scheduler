// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authenticateToken = require('../authenticateToken');

// GET all events
router.get('/', async (req, res) => {
    try {
        let events;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        console.log(req.query);
        if(startDate && endDate) {
            events = await Event.find({
                startDate: {
                    $gte: new Date(startDate)
                },
                endDate: {
                    $lte: new Date(endDate)
                }
            }).populate('league').populate('opponent').sort({startDate: 'asc'});
        }
        else {
            events = await Event.find({}).populate('league').populate('opponent').sort({startDate: 'asc'}); //populate league field and opponent
        }
        console.log(events);
        res.json(events);
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//GET a specific event by id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('league').populate('opponent');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ message: 'Event created successfully.' }); //had to take out ",event"
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update an event
router.put('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;