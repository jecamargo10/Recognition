'use strict';

var User = require('../models/user_model');
var mongoose = require('mongoose');

let fileScope = "false";
let formula = "";




exports.getStatus = function (req, res) {
return  res.json(fileScope);
};
exports.getFormula = function (req, res) {
return  res.json(formula);
};

exports.changeStatus = function (req, res) {
  console.log(req.body.stuff)
    fileScope = req.body.stuff
    return res.send(fileScope);
};
exports.revert = function (req, res) {
    fileScope = "false"
    return res.send(fileScope);
};
exports.changeFormula = function (req, res) {
    formula = req.body
    return res.send(formula);
};

/** create function to create User. */
exports.create = function (req, res) {
    User.create(req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get User by id. */
exports.get = function (req, res) {
    User.get({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get User by grouping. */
exports.getByGrouping = function (req, res) {
    User.getAll({groupings: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get User by grouping. */
exports.getByGroupingBallotNoVote = function (req, res) {
    User.getAll({groupings: req.params.groupingId}, function(err, result) {
        if (!err) {
                var VoteTokenSchema = mongoose.model('VoteToken');
                let itemsProcessed = 0;
                let resultParsed = [];
                result.forEach(item => {
                    VoteTokenSchema.find({user: item._id, ballot: req.params.ballotId}, (err, vt) => {
                        if(!err) {
                            let newOb = {
                                _id: item._id,
                                names: item.names,
                                lastNames: item.lastNames,
                                countryCode: item.countryCode,
                                phoneNumber: item.phoneNumber,
                                email: item.email
                            };
                            if(vt.length > 0) {
                                newOb.voted = true;
                            } else {
                                newOb.voted = false;
                            }
                            resultParsed.push(newOb);
                            itemsProcessed ++;
                            if(itemsProcessed === result.length) {
                                res.send(resultParsed);
                            }
                        } else {
                            return res.send(err);
                        }
                    });
                });
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getByEmail = function (req, res) {
    User.get({email: req.params.email}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get all User. */
exports.getAll = function (req, res) {
    User.getAll({}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get all User. */
exports.getAdmin = function (req, res) {
    User.getAll({role: 'admin'}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** getCompany function to get all User. */
exports.getUser = function (req, res) {
    User.getAll({role: 'user'}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** updateCompany function to update User by id. */
exports.update = function (req, res) {
    User.updateById(req.params.id, req.body, function(err, result) {
        if (!err) {
            console.log(res);
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.addGrouping = function (req, res) {
    User.updateById(req.params.id, {$push: { adminGroupings: req.body.grouping }}, function(err, result) {
        if (!err) {
            console.log(res);
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

/** removeCompany function to remove Client by id. */
exports.delete = function (req, res) {
    User.removeById({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
}
