const express = require('express'),
  router = express.Router();

// controllers
const dreamsController = require('../controllers/dreams');
//midleware
const imageMulter = require('../middleware/imageFileMulter');
// models
const Dream = require('../models/dream');
// Helpers
const { ensureAuthenticated } = require('../helpers/auth');
const { calculateVotes, calculateUniqueVotes } = require('../helpers/vote');
const { escapeRegex } = require('../helpers/controllerHelpers');

//fire config
const admin = require('firebase-admin');
const config = require('../config/keys');
// const serviceAccount = config.firebaseStorageprivateKeyPath; //path/to/serviceAccountKey.json

const serviceAccount = {
  type: config.type,
  project_id: config.project_id,
  private_key_id: config.private_key_id,
  private_key: config.private_key.replace(/\\n/g, '\n'),
  client_email: config.client_email,
  client_id: config.client_id,
  auth_uri: config.auth_uri,
  token_uri: config.token_uri,
  auth_provider_x509_cert_url: config.auth_provider_x509_cert_url,
  client_x509_cert_url: config.client_x509_cert_url
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebaseStoragestorageBucketURL
});

var bucket = admin.storage().bucket();

// add admin to the request params to get into controller zone
router.use(function(req, res, next) {
  if (!req.admin) {
    req.admin = admin;
  }
  if (!req.bucket) {
    req.bucket = bucket;
  }
  next();
});
//end fire config

// * safe routes
// get public dreams view
router.get('/', (req, res, next) => {
  // search
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Dream.find({ title: regex, status: 'public' })
      .sort({ date: 'desc' })
      .populate('creator')
      .then(async dreams => {
        if (dreams.length < 1) {
          res.render('index/search', { search: req.query.search });
        } else {
          // add Votes
          dreams = await calculateVotes(dreams, req.user);
          // sort by totall votes
          dreams = dreams.sort((s1, s2) =>
            s1.totalVotes < s2.totalVotes ? 1 : -1
          );
          // render view
          return res.render('dreams/index', { dreams });
        }
      });
  } else {
    Dream.find({ status: 'public' })
      .sort({ date: 'desc' })
      .populate('creator')
      .then(async dreams => {
        // add Votes
        dreams = await calculateVotes(dreams, req.user);
        // sort by totall votes
        dreams = dreams.sort((s1, s2) =>
          s1.totalVotes < s2.totalVotes ? 1 : -1
        );

        // render view
        return res.render('dreams/index', { dreams });
      });
  }
});
// add get add dream view
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('dreams/add');
});
// get dream by id
router.get('/show/:id', (req, res) => {
  Dream.findOne({ _id: req.params.id })
    .populate('creator')
    .populate('comments.commentCreator')
    .then(async dream => {
      if (dream.status == 'public') {
        // add totalVotes
        const dreamWithVotes = await calculateUniqueVotes(dream, req.user);
        dream = dreamWithVotes;
        return res.render('dreams/show', { dream });
      } else if (req.user) {
        if (dream.creator.id == req.user.id) {
          // add totalVotes
          const dreamWithVotes = await calculateUniqueVotes(dream, req.user);
          dream = dreamWithVotes;
          return res.render('dreams/show', { dream });
        } else {
          res.redirect('/dreams');
        }
      } else {
        res.redirect('/dreams');
      }
    });
});
// get edit dream view
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Dream.findOne({ _id: req.params.id }).then(dream => {
    if (dream.creator != req.user.id) {
      res.redirect(`/dreams/show/${dream.id}`);
    } else {
      res.render('dreams/edit', { dream });
    }
  });
});
// get dreams by user
router.get('/user/:userId', (req, res) => {
  Dream.find({ creator: req.params.userId, status: 'public' })
    .sort({ date: 'desc' })
    .populate('creator')
    .then(async dreams => {
      // add totalVotes
      const dreamsWithVotes = await calculateVotes(dreams, req.user);
      dreams = dreamsWithVotes;
      // sort by totall votes
      dreams = dreams.sort((s1, s2) =>
        s1.totalVotes < s2.totalVotes ? 1 : -1
      );
      res.render('dreams/index', { dreams });
    });
});
// get dreams by authenticated user
router.get('/my', ensureAuthenticated, (req, res) => {
  Dream.find({ creator: req.user.id })
    .populate('creator')
    .sort({ date: 'desc' })
    .then(async dreams => {
      // add totalVotes
      const dreamsWithVotes = await calculateVotes(dreams, req.user);
      dreams = dreamsWithVotes;
      // sort by totall votes
      dreams = dreams.sort((s1, s2) =>
        s1.totalVotes < s2.totalVotes ? 1 : -1
      );
      res.render('dreams/index', { dreams });
    });
});

// * unsafe Routes
router.post(
  '/add',
  imageMulter,
  ensureAuthenticated,
  dreamsController.addDream
);
router.put(
  '/edit/:id',
  imageMulter,
  ensureAuthenticated,
  dreamsController.editDream
);
router.delete('/:id', ensureAuthenticated, dreamsController.deleteDream);
// * Comments
router
  .route('/comment/:dreamId')
  .post(ensureAuthenticated, dreamsController.addComment)
  .delete(ensureAuthenticated, dreamsController.deleteComment);

// * Votes
// External vote collection
router.post(
  '/upVote/:dreamId/:vote',
  ensureAuthenticated,
  dreamsController.upVoteToggle
);
router.post(
  '/downVote/:dreamId/:vote',
  ensureAuthenticated,
  dreamsController.downVoteToggle
);
module.exports = router;
