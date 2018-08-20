var mongoose = require('mongoose');

module.exports = function () {
    mongoose = require('mongoose');
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SchoolDatabase', { useNewUrlParser: true });


}