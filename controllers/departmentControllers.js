var mongoose = require('mongoose');
var Department = require('../models/DepartmentModel');
var Student = require('../models/studentModel')
var async = require('async');


// Display list of all Departments.
exports.department_list = function (req, res, next) {

    Department.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_departments) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('department_list', { title: 'Department List', list_departments: list_departments });
        });

};


// Display detail page for a specific Department.
exports.department_detail = function (req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        department: function (callback) {
            Department.findById(id)
                .exec(callback);
        },

        department_students: function (callback) {
            Student.find({ 'department': id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.department == null) { // No results.
            var err = new Error('Department not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('department_detail', { title: 'Department Detail', department: results.department, department_students: results.department_students });
    });

};

// Display Department delete form on GET.
exports.department_delete_get = function (req, res, next) {
    async.parallel({
        department: function (callback) {
            Department.findById(req.params.id).exec(callback)
        },
        faculties_students: function (callback) {
            Student.find({ 'department': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.department == null) { // No results.
            res.redirect('/catalog/faculties');
        }
        // Successful, so render.
        res.render('department_delete', { title: 'Delete Department', department: results.department, department_students: results.faculties_students });
    });
};

// Handle Department delete on POST.
exports.department_delete_post = function (req, res, next) {
    async.parallel({
        department: function (callback) {
            Department.findById(req.body.departmentid).exec(callback)
        },
        faculties_students: function (callback) {
            Student.find({ 'department': req.body.departmentid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.faculties_students.length > 0) {
            // Department has students. Render in same way as for GET route.
            res.render('department_delete', { title: 'Delete Department', department: results.department, department_students: results.faculties_students });
            return;
        }
        else {
            // Department has no students. Delete object and redirect to the list of depts.
            Department.findByIdAndRemove(req.body.departmentid, function deleteDepartment(err) {
                if (err) { return next(err); }
                // Success - go to department list
                res.redirect('/list/departments')
            })
        }
    });
};


// Display Department delete form on GET.
exports.department_delete_get = function (req, res, next) {
    async.parallel({
        department: function (callback) {
            Department.findById(req.params.id).exec(callback)
        },
        departments_students: function (callback) {
            Student.find({ 'department': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.department == null) { // No results.
            res.redirect('/list/departments');
        }
        // Successful, so render.
        res.render('department_delete', { title: 'Delete Department', department: results.department, department_students: results.departments_students });
    });
};

