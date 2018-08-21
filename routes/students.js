var express = require('express');
var router = express.Router();

// Require controller modules.
var student_controller = require('../controllers/studentController');
var level_controller = require('../controllers/levelController');
var department_controller = require('../controllers/departmentControllers');
var faculty_controller = require('../controllers/facultyController');


/// student ROUTES ///

// GET request for list of all student items.
router.get('/students', student_controller.student_list);

// GET request for creating a student. 
router.get('/student/create', student_controller.student_create_get);

// POST request for creating student.
router.post('/student/create', student_controller.student_create_post);

// GET request to delete student.
router.get('/student/:id/delete', student_controller.student_delete_get);

// POST request to delete student.
router.post('/student/:id/delete', student_controller.student_delete_post);



/// LEVEL ROUTES ///

// GET request for one level.
router.get('/level/:id', level_controller.level_detail);

// GET request for list of all Levels.
router.get('/levels', level_controller.level_list);

// // GET request to delete level.
router.get('/level/:id/delete', level_controller.level_delete_get);

// // POST request to delete level.
router.post('/level/:id/delete', level_controller.level_delete_post);


/// department ROUTES ///


//  GET request to delete department.
router.get('/department/:id/delete', department_controller.department_delete_get);

//  POST request to delete department.
router.post('/department/:id/delete', department_controller.department_delete_post);


// GET request for one department.
router.get('/department/:id', department_controller.department_detail);

// GET request for list of all department.
router.get('/departments', department_controller.department_list);

/// AUTHOR ROUTES ///

// GET request for one faculty.
router.get('/faculty/:id', faculty_controller.faculty_detail);

// GET request for list of all faculties.
router.get('/faculties', faculty_controller.faculty_list);


//  GET request to delete faculty.
router.get('/faculty/:id/delete', faculty_controller.faculty_delete_get);

//  POST request to delete faculty.
router.post('/faculty/:id/delete', faculty_controller.faculty_delete_post);



module.exports = router;