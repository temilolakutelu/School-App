var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacultySchema = new Schema({
    name: { type: String, required: true, min: 5, max: 100 }
});

// Virtual for this faculty instance URL.
FacultySchema
    .virtual('url')
    .get(function () {
        return '/list/faculty/' + this._id;
    });

// Export model.
module.exports = mongoose.model('Faculty', FacultySchema);