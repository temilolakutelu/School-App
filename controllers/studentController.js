var mongoose = require('mongoose')
var Student = require('../models/studentModel');
var Level = require('../models/levelModel');
var Department = require('../models/DepartmentModel');
var Faculty = require('../models/facultyModel');
var async = require('async');

// Display list of allstudents.
exports.student_list = function (req, res, next) {

    Student.find({}, 'first_name last_name level department faculty ')

        .populate('level')
        .populate('department')
        .populate('faculty')
        .exec(function (err, list_students) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('student_list', { title: 'Student List', student_list: list_students });
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
        res.render('student_form', { title: 'Create Student', levels: results.levels, departments: results.departments, faculties: results.faculties });
    });

};


// Handle student create on POST.
exports.student_create_post = [
    // Convert the level to an array.
    (req, res, next) => {
        if (!(req.body.level instanceof Array)) {
            if (typeof req.body.level === 'undefined')
                req.body.level = [];
            else
                req.body.level = new Array(req.body.level);
        }
        next();
    },

    (req, res, next) => {


        // Create a Student object with escaped and trimmed data.
        var student = new Student(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                level: req.body.level,
                department: req.body.department,
                faculty: req.body.faculty,


            });
        async.parallel({
            departments: function (callback) {
                Department.find(callback);
            },
            levels: function (callback) {
                Level.find(callback);
            },
            faculties: function (callback) {
                Faculty.find(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            // Mark our selected levels as checked.
            for (let i = 0; i < results.levels.length; i++) {
                if (student.level.indexOf(results.levels[i]._id) > -1) {
                    results.levels[i].checked = 'true';
                }
            }
            res.render('student_form', {
                title: 'Create Student', departments: results.departments, levels: results.levels,
                faculties: results.department,
                student: student, errors: errors.array()
            });
        });

        student.save(function (err) {
            if (err) { return next(err); }
            //successful - redirect to new student record.
            res.redirect(student.url);
        });
    }

];

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

            Student.findByIdAndRemove(req.body.id, function deleteStudent(err) {
                if (err) { return next(err); }
                // Success - got to students list.
                res.redirect('/list/students');
            });

        }
    });
};


