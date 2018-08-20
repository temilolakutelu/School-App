var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}


var async = require('async')
var Student = require('./models/studentModel');
var Level = require('./models/levelModel');
var Department = require('./models/DepartmentModel');
var Faculty = require('./models/facultyModel');



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var students = []
var levels = []
var departments = []
var faculties = []



function levelCreate(level, cb) {
    var level = new Level({ level: level });

    level.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Level: ' + level);
        levels.push(level)
        cb(null, level);
    });
}


function DepartmentCreate(name, cb) {
    var department = new Department({ name: name });

    department.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Department: ' + department);
        departments.push(department)
        cb(null, department);
    });
}


function facultyCreate(name, cb) {
    var faculty = new Faculty({ name: name });

    faculty.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Faculty: ' + faculty);
        faculties.push(faculty)
        cb(null, faculty);
    });
}


function studentCreate(first_name, last_name, level, department, faculty, cb) {
    studentdetail = {
        first_name: first_name,
        last_name: last_name

    }
    if (level != false) studentdetail.level = level
    if (department != false) studentdetail.department = department
    if (faculty != false) studentdetail.faculty = faculty

    var student = new Student(studentdetail);
    student.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Student: ' + student);
        students.push(student)
        cb(null, student)
    });
}


function createStudentDetails(cb) {
    async.parallel([
        function (callback) {
            levelCreate('100', callback);
        },

        function (callback) {
            levelCreate('200', callback);
        },
        function (callback) {
            levelCreate('300', callback);
        },

        function (callback) {
            levelCreate('400', callback);
        },
        function (callback) {
            DepartmentCreate('Computer Science', callback);
        },
        function (callback) {
            DepartmentCreate('Mathematics', callback);
        },
        function (callback) {
            DepartmentCreate('English', callback);
        },
        function (callback) {
            facultyCreate('Faculty of Engineering', callback);
        },
        function (callback) {
            facultyCreate('Faculty of Science', callback);
        },
        function (callback) {
            facultyCreate('Faculty of Art', callback);
        },
    ],
        // optional callback
        cb);
}

// first_name, last_name, level, department, faculty, cb
function createStudents(cb) {
    async.parallel([
        function (callback) {
            studentCreate("Temilola", "Kutelu", levels[3], departments[0], faculties[0], callback);
        },
        function (callback) {
            studentCreate("Osama", "Imafidon", levels[1], departments[2], faculties[2], callback);
        },
        function (callback) {
            studentCreate("Bukola", "Lucky", levels[0], departments[1], faculties[1], callback);
        },

    ],
        // optional callback
        cb);
}


async.series([
    createStudentDetails,
    createStudents,

],
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }

        mongoose.connection.close();
    });
