const express = require("express");
const Event = require("../models/event");
const { requireRole, authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post(
    "/",
    authenticate,
    requireRole("ADMINISTRATOR"),
    async (req, res) => {
        try {
            const event = new Event(req.body);
            await event.save();
            res.status(201).json(event);
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.put(
    "/:id",
    authenticate,
    requireRole("ADMINISTRATOR"),
    async (req, res) => {
        try {
            const event = await Event.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (event) {
                res.json(event);
            } else {
                res.status(404).json({ message: "Event not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.delete(
    "/:id",
    authenticate,
    requireRole("ADMINISTRATOR"),
    async (req, res) => {
        try {
            const event = await Event.findByIdAndDelete(req.params.id);
            if (event) {
                res.json({ message: "Event deleted" });
            } else {
                res.status(404).json({ message: "Event not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.post(
    "/registration/:id",
    authenticate,
    requireRole("STUDENT"),
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            if (event.registrationClosed) {
                return res
                    .status(400)
                    .json({ message: "Registration closed for this event" });
            }
            if (event.registeredStudents.includes(req.user._id)) {
                return res
                    .status(400)
                    .json({ message: "Already registered for this event" });
            }
            event.registeredStudents.push(req.user._id);
            await event.save();
            res.json({ message: "Registered for event" });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.put(
    "/registration/:id",
    authenticate,
    requireRole("ADMINISTRATOR", "FACULTY"),
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            if (!event.registeredStudents.includes(req.body.studentId)) {
                return res
                    .status(400)
                    .json({ message: "Student not registered for this event" });
            }
            event.registeredStudents = event.registeredStudents.filter(
                (id) => id !== req.body.studentId
            );
            await event.save();
            res.json({ message: "Event registration removed" });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;
