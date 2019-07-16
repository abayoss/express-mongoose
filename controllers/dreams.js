// models
const Dream = require('../models/dream');
const Vote = require('../models/vote');
const {uploadFileGetUrl} = require('../helpers/controllerHelpers');
module.exports = {
  addDream: async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const newDream = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      creator: req.user.id,
      image: url + '/img/NoImage.jpg'
    };
    if (!newDream.body) newDream.body = 'to be writen soon...';
    if (!req.body.allowComments) {
      newDream.allowComments = false;
    }
    if (req.file) {
      newDream.image = await uploadFileGetUrl(req.file, req.bucket);
    }
    new Dream(newDream).save().then(dream => {
      res.redirect(`/dreams/show/${dream.id}`);
    });
  },
  editDream: (req, res) => {
    Dream.findOne({ _id: req.params.id }).then(async dream => {
      // new values
      dream.title = req.body.title;
      dream.body = req.body.body;
      dream.status = req.body.status;
      if (req.body.allowComments) {
        dream.allowComments = true;
      } else {
        dream.allowComments = false;
      }
      if (req.file) {
        const image = await uploadFileGetUrl(req.file, req.bucket);
        if (image !== false) {
          dream.image = image;
        }
      }
      dream.save().then(dream => {
        res.redirect(`/dreams/show/${dream.id}`);
      });
    });
  },
  deleteDream: (req, res) => {
    Dream.deleteOne({ _id: req.params.id }).then(dream => {
      Vote.deleteMany({ storyId: req.params.id }).then(votes =>
        res.redirect(`/dashboard`)
      );
    });
  },
  addComment: (req, res) => {
    Dream.findOne({ _id: req.params.storyId }).then(dream => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentCreator: req.user.id
      };
      // add to the begining of the array
      dream.comments.unshift(newComment);

      dream.save().then(dream => {
        res.redirect(`/dreams/show/${dream.id}`);
      });
    });
  },
  deleteComment: () => {
    // ! until improuving app
  },
  // External votes :
  upVoteToggle: (req, res) => {
    // toggle Vote
    let voteNum = req.params.vote == 1 ? 0 : 1;
    // find the concerned Story
    Dream.findOne({ _id: req.params.dreamId }).then(dream => {
      // * [X] check if it's his first vote on this story
      Vote.findOne({
        storyId: dream.id,
        voteCreator: req.user
      }).then(vote => {
        if (!vote) {
          // * [X] create new vote with direction and creator
          const newVote = {
            direction: voteNum,
            storyId: dream.id,
            voteCreator: req.user
          };
          new Vote(newVote).save().then(vote => {
            dream.votes = vote.id;
            return res.json({ message: 'up vote created', vote });
          });
        } else {
          // * [X] update the vote direction
          vote.direction = voteNum;
          vote.save().then(vote => {
            return res.json({ message: 'up vote updated', vote });
          });
        }
      });
    });
  },
  downVoteToggle: (req, res) => {
    //  toggle Vote
    let voteNum = req.params.vote == -1 ? 0 : -1;
    //  find the concerned Story
    Dream.findOne({ _id: req.params.dreamId }).then(dream => {
      //  check if it's his first vote on this story
      Vote.findOne({
        storyId: dream.id,
        voteCreator: req.user
      }).then(vote => {
        if (!vote) {
          //  create new vote with direction and creator
          const newVote = {
            direction: voteNum,
            storyId: dream.id,
            voteCreator: req.user
          };
          new Vote(newVote).save().then(vote => {
            dream.votes = vote.id;
            return res.json({ message: 'down vote created', dream, vote });
          });
        } else {
          // update the vote direction
          vote.direction = voteNum;
          vote.save().then(vote => {
            return res.json({ message: 'down vote updated', dream, vote });
          });
        }
      });
    });
  }
};
