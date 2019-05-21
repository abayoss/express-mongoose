const express = require('express'),
    router = express(),
    imageCheck = require('../../middleware/imageFileMulter'),
    postsController = require('../../controllers/api/posts');

// Routes :
router.get('', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.put('/:id', imageCheck, postsController.UpdatePost);
router.post('/add', imageCheck, postsController.addPost);
router.delete('/:id', postsController.deletePost);

module.exports = router;