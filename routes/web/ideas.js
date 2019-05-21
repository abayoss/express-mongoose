const express = require("express");
const router = express.Router();
const ideasController = require("../../controllers/web/ideas");

// Idea Index Page
router.get("/", ideasController.getIdeas);

// Add Idea Form
router.get("/add", ideasController.getAddIdea);

// Edit Idea Form
router.get("/edit/:id", ideasController.getIdea);

// Process Form
router.post("/", ideasController.addIdea);

// Edit Form process
router.put("/:id", ideasController.editIdea);

// Delete Idea
router.delete("/:id", ideasController.deleteIdea);

module.exports = router;
