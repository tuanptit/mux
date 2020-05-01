var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var muxSchema = new Schema({
    name: String,
    ip_address: String,
    location: Number,
    type: Number, // 0 - visat; 1 - vietel; 2 - vnpt
    read_community: String,
    write_community: String,
    alarms: [{type: Schema.Types.ObjectId, ref: 'Alarm'}]
});
module.exports = mongoose.model('Mux', muxSchema);