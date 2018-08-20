var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    name: { type: String, required: true, min: 5, max: 100 }
});

// Virtual for this department instance URL.
DepartmentSchema
    .virtual('url')
    .get(function () {
        return '/list/department/' + this._id;
    });

// Export model.
module.exports = mongoose.model('Department', DepartmentSchema);