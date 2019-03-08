const express = require('express'),
    router = express(),
    postsController = require('../controllers/posts');

// Routes :
router.get('', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.put(':id', postsController.UpdatePost);
router.delete('/:id', postsController.deletePost);
router.post('add', postsController.addPost);

module.exports = router;