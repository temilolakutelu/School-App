var mongoose = require('mongoose')
var Student = require('../models/studentModel');
var Level = require('../models/levelModel');
var Department = require('../models/DepartmentModel');
var Faculty = require('../models/facultyModel');
var async = require('async');

exports.index = function (req, res) {

    async.parallel({
        student_count: function (callback) {
            Student.countDocuments({}, callback);
        },
        level_count: function (callback) {
            Level.countDocuments({}, callback);
        },
        department_count: function (callback) {
            Department.countDocuments({}, callback);
        },
        faculty_count: function (callback) {
            Faculty.countDocuments({}, callback);
        },

    }, function (err, results) {
        res.render('index', { title: 'School Database', error: err, data: results });
    });
};
// Display list of allstudents.
exports.student_list = function (req, res, next) {

    Student.find({}, 'level department faculty')

        .populate('level')
        .populate('department')
        .populate('faculty')
        .exec(function (err, list_students) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('student_list', { title: 'Student List', student_list: list_students });
        });

};


// Display detail page for a specific student.
exports.student_detail = function (req, res, next) {

    async.parallel({
        student: function (callback) {

            Student.findById(req.params.id)
                .populate('level')
                .populate('department')
                .populate('faculty')
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.student == null) { // No results.
            var err = new Error('Student not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('student_details', { title: 'Student details', student: results.student });
    });

};


// Display student create form on GET.
exports.student_create_get = function (req, res, next) {
    // Get all levels and departments, which we can use for adding to our student.
    async.parallel({
        levels: function (callback) {
            Level.find(callback);
        },
        departments: function (callback) {
            Department.find(callback);
        },
        faculties: function (callback) {
            Faculty.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('student_form', { title: 'Create Student', levels: results.levels, departments: results.departments });
    });

};


// Display student delete form on GET.
exports.student_delete_get = function (req, res, next) {
    async.parallel({
        student: function (callback) {
            Student.findById(req.params.id).populate('level').populate('department').populate('faculty').exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.Student == null) { // No results.
            res.redirect('/list/Students');
        }
        // Successful, so render.
        res.render('Student_delete', { title: 'Delete Student', Student: results.Student });
    });
};

// Handle student delete on POST.
exports.student_delete_post = function (req, res, next) {
    async.parallel({
        student: function (callback) {
            Student.findById(req.params.id).populate('level').populate('department').populate('faculty').exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        // Success

        else {
            // Student has no objects. Delete object and redirect to the list of students.
            Student.findByIdAndRemove(req.body.id, function deleteStudent(err) {
                if (err) { return next(err); }
                // Success - got to students list.
                res.redirect('/list/students');
            });

        }
    });
};


