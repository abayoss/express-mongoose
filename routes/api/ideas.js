const express = require("express");
const router = express.Router();
const ideasController = require("../../controllers/api/ideas");

// Idea Index Page
router.get("/", ideasController.getIdeas);

// Add Idea Form
router.get("/add", ideasController.addIdea);

// Edit Idea Form
router.get("/:id", ideasController.getIdea);

// Process Form
router.post("/", ideasController.addIdea);

// Edit Form process
router.put("/:id", ideasController.editIdea);

// Delete Idea
router.delete("/:id", ideasController.deleteIdea);

module.exports = router;
