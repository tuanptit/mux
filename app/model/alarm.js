var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var almSchema = new Schema({
    oid: String,
    value: String,
    date: String,
    ip_address: String
});
module.exports = mongoose.model('Alarm', almSchema);