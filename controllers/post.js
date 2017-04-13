var qs = require('querystring');
var User = require('../models/User');
var Committee = require('../models/Committee');

/**
 * POST /posts
 * Create a new post
 */
exports.postPost = function(req, res, next) {
	if(!req.user || req.user.level == undefined || req.user.level < 1) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('body', 'Body cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  let post = new Post({
  	committee: req.body.committee,
    title: req.body.title,
    body: req.body.body
  });
  post.save(function(err) {
  	res.send({ post: post });
  });
};

/**
 * PUT /committees
 * Update a committee
 */
exports.committeePut = function(req, res, next) {
  if(!req.user || req.user.level == undefined || req.user.level < 2) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Committee.findById(req.body._id, function(err, committee) {
    committee.name = req.body.name;
    if(req.body.members != null) {
      req.body.members.forEach( function(member_id) {
        if(committee.members.indexOf(member_id) == -1) {
          addCommitteeToUser(member_id, req.body._id);
        }
      });
      committee.members.forEach( function (member_id) {
        if(req.body.members.indexOf(member_id) == -1) {
          removeCommitteeFromUser(member_id, req.body._id);
        }
      });
    }

    committee.members = req.body.members || [];

    committee.description = req.body.description;
      
    committee.save(function(err) {
      res.send({ committee: committee });
    });
    
    });
};

addCommitteeToUser = function(uid, cid) {
  console.log(uid);
  User.findById(uid, function(err, user) {
    if(user) {
      if(!user.committees) {
        user.committees = [];
      }
      if(user.committees.indexOf(cid) == -1) {
        user.committees.push(cid);
        user.save(function(err) {
          return;
        });
      }
    } 
  });
}

removeCommitteeFromUser = function(uid, cid) {
  User.findById(uid, function(err, user) {
    if(user) {
      if(!user.committees) {
        return;
      }
      if(user.committees.indexOf(cid) != -1) {
        user.committees.splice(user.committees.indexOf(cid), 1);
        user.save(function(err) {
          return;
        });
      } 
    }
  });
}

/**
 * Get /committees
 * return all committees
 */
exports.committeesGet = function(req, res, next) {
  Committee.find(function (err, committees) {
    if(err) {
      console.log(err);
    }
    if (!committees) {
      return res.status(400).send({ msg: 'No committees could be found' });
    } else {
      res.send({ committees: committees });
    }
  });
};

/**
 * Delete /committee/:id
 * delete a committee
 */
exports.committeeDelete = function(req, res, next) {
  if(!req.user || req.user.level == undefined || req.user.level < 2) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  Committee.remove({ _id: req.params.id }, function(err) {
    res.send({ msg: 'This committee has been permanently deleted.' });
  });
};
