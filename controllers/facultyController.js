
var mongoose = require('mongoose');
var Faculty = require('../models/facultyModel');
var Student = require('../models/studentModel')
var async = require('async');

// Display list of all Faculty.
exports.faculty_list = function (req, res, next) {

    Faculty.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_faculties) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('faculty_list', { title: 'Faculty List', list_faculties: list_faculties });
        });

};

// Display detail page for a specific Faculty.
exports.faculty_detail = function (req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        faculty: function (callback) {
            Faculty.findById(id)
                .exec(callback);
        },

        faculty_students: function (callback) {
            Student.find({ 'faculty': id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.faculty == null) { // No results.
            var err = new Error('Faculty not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('faculty_detail', { title: 'Faculty Detail', faculty: results.faculty, faculty_students: results.faculty_students });
    });

};



// Display Faculty delete form on GET.
exports.faculty_delete_get = function (req, res, next) {
    async.parallel({
        faculty: function (callback) {
            Faculty.findById(req.params.id).exec(callback)
        },
        faculties_students: function (callback) {
            Student.find({ 'faculty': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.faculty == null) { // No results.
            res.redirect('/catalog/faculties');
        }
        // Successful, so render.
        res.render('faculty_delete', { title: 'Delete Faculty', faculty: results.faculty, faculty_students: results.faculties_students });
    });
};

// Handle Faculty delete on POST.
exports.faculty_delete_post = function (req, res, next) {
    async.parallel({
        faculty: function (callback) {
            Faculty.findById(req.body.facultyid).exec(callback)
        },
        faculties_students: function (callback) {
            Student.find({ 'faculty': req.body.facultyid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.faculties_students.length > 0) {
            // Faculty has students. Render in same way as for GET route.
            res.render('faculty_delete', { title: 'Delete Faculty', faculty: results.faculty, faculty_students: results.faculties_students });
            return;
        }
        else {
            // Faculty has no students. Delete object and redirect to the list of faculties.
            Faculty.findByIdAndRemove(req.body.facultyid, function deleteFaculty(err) {
                if (err) { return next(err); }
                // Success - go to faculty list
                res.redirect('/list/faculties')
            })
        }
    });
};