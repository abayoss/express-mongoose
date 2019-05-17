const express = require('express'),
    router = express(),
    imageCheck = require('../middleware/imageFileMulter'),
    authCheck = require("../middleware/auth-check");
    postsController = require('../controllers/posts');

// * post routes
router.get('', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.put('/:id', authCheck, imageCheck, postsController.UpdatePost);
router.post('/add', authCheck, imageCheck, postsController.addPost);
router.delete('/:id', authCheck, postsController.deletePost);


module.exports = router;