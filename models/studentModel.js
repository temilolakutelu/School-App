var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        first_name: { type: String, required: true, max: 100 },
        last_name: { type: String, required: true, max: 100 },
        level: { type: Schema.ObjectId, ref: 'Level', required: true },
        department: { type: Schema.ObjectId, ref: 'Department', required: true },
        faculty: { type: Schema.ObjectId, ref: 'Faculty', required: true },
    }
);

// Virtual for Student "full" name.
StudentSchema
    .virtual('name')
    .get(function () {
        return this.last_name + ', ' + this.first_name;
    });

// Virtual for this student instance URL.
StudentSchema
    .virtual('url')
    .get(function () {
        return '/list/student' + this._id
    });



module.exports = mongoose.model('Student', StudentSchema);