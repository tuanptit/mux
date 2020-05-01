var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    name: String,
    type: String,
    hw_version: String,
    sw_version: String,
    alarm_status: Number,
    hw_status: Number,
    activity: String
});
module.exports = mongoose.model('Card', cardSchema);