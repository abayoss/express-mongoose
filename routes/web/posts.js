const express = require("express");
const router = express.Router();
const imageCheck = require('../../middleware/imageFileMulter');
const postsController = require("../../controllers/web/posts");

// post Page

router.get('', postsController.getPosts);
router.get('/add', postsController.getAddPost);
router.post('/add', imageCheck, postsController.addPost);
router.get('/:id', postsController.getUpdatePost);
router.put('/:id', imageCheck, postsController.UpdatePost);
router.delete('/:id', postsController.deletePost);

module.exports = router;
