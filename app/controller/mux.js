var Mux = require('../model/mux');

exports.addMux = function(req, res){
    var mux = new Mux({
        name: req.body.name,
        ip_address: req.body.ip_address,
        location: req.body.location,
        type: req.body.type,
        read_community: req.body.read_community,
        write_community: req.body.read_community
    });
    mux.save(function(err){
        if(err) {
            res.json({
                code: 1
            })
        } else {
            res.render('add-device', { result: {
                    code:1,
                    status:1
                } });
        }
    });
}
exports.getMux = function(req, res) {
    Mux.find({},
        function (err, muxs) {
        if(err) {
            res.json({
                code: 1,
                result:'err'
            })
        } else {
            var list =[];
            for(var i = 0; i, i < muxs.length; i++) {
                var mMux = {
                    id: muxs[i]._id,
                    name: muxs[i].name,
                    ip_address: muxs[i].ip_address,
                    location: muxs[i].location,
                    type: muxs[i].type,
                    read_community: muxs[i].read_community,
                    write_community: muxs[i].write_community
                }
                list.push(mMux);
            }
            res.json({
                code:0,
                result: muxs
            });
        }
    })
}

exports.getMuxById = function(req, res) {
    var id = req.params.id;
    Mux.findOne({
        _id: id
    }, function (err, mux) {
        if(err) {
            res.json({
                code: 1,
                result:'err'
            })
        } else {
            res.render('mux-detail', {result: mux})
        }
    })
}