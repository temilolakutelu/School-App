var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LevelSchema = new Schema({
    level: { type: String, required: true }
});

// Virtual for this level instance URL.
LevelSchema
    .virtual('url')
    .get(function () {
        return '/list/level/' + this._id;
    });

// Export model.
module.exports = mongoose.model('Level', LevelSchema);