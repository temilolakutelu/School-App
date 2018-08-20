var mongoose = require('mongoose');
var Level = require('../models/levelModel');
var Student = require('../models/studentModel');
var async = require('async');

// Display list of all Level.
exports.level_list = function (req, res, next) {

    Level.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_levels) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('level_list', { title: 'Level List', list_levels: list_levels });
        });

};

// Display detail page for a specific Level.
exports.level_detail = function (req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        level: function (callback) {
            Level.findById(id)
                .exec(callback);
        },

        level_lists: function (callback) {
            Level.find({ 'level': id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.level == null) { // No results.
            var err = new Error('Level not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('level_detail', { title: 'Level Detail', level: results.level, level_lists: results.level_lists });
    });

};

// Display Leveldelete form on GET.
exports.level_delete_get = function (req, res, next) {

    async.parallel({
        level: function (callback) {
            Level.findById(req.params.id).exec(callback)
        },
        levels_students: function (callback) {
            Student.find({ 'level': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.level == null) { // No results.
            res.redirect('/list/levels');
        }
        // Successful, so render.
        res.render('level_delete', { title: 'Delete Level', level: results.level, level_students: results.levels_students });
    });
};


// Handle Level delete on POST.
exports.level_delete_post = function (req, res, next) {
    async.parallel({
        level: function (callback) {
            Level.findById(req.body.levelid).exec(callback)
        },
        levels_students: function (callback) {
            Student.find({ 'level': req.body.levelid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.levels_students.length > 0) {
            // Level has students. Render in same way as for GET route.
            res.render('level_delete', { title: 'Delete Level', level: results.level, level_students: results.levels_students });
            return;
        }
        else {
            // Level has no students. Delete object and redirect to the list of levels.
            Level.findByIdAndRemove(req.body.levelid, function deleteLevel(err) {
                if (err) { return next(err); }
                // Success - go to level list
                res.redirect('/list/levels')
            })
        }
    });
};