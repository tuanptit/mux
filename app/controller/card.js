var Card = require('../model/card');
var snmp = require ("net-snmp");
    var async = require('async');
var list = [];



exports.getAllCard =  function (req, res) {
    // Default options
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };
    var session = snmp.createSession(req.params.ip_address, "public", options);
    var list = [];
    var oids = ["1.3.6.1.4.1.164.3.3.2.1.1.1.1.", "1.3.6.1.4.1.164.3.3.2.1.1.1.2.",
        "1.3.6.1.4.1.164.3.3.2.1.1.1.4.", "1.3.6.1.4.1.164.3.3.2.1.1.1.6.",
        "1.3.6.1.4.1.164.3.3.2.1.1.1.8.", "1.3.6.1.4.1.164.3.3.2.1.1.1.9."];
    var data = [];
    for(var i = 101; i <= 118; i++) {
        var item = oids.map(x => x+i);
        data.push(item)
    }
    async.eachSeries(data, function (oid, callback) {
        getCardByOid(session, oid,function (result, err) {
            if(!err) {
                list.push(result);
                callback();
            } else {
                callback(err);
            }
        });
    }, function (err) {
        if(err) {
            session.close();
            res.json({
                code: 0,
                result: 'timeout'
            })
        } else {
            session.close();
            res.json({
                code: 1,
                result: list
            });
        }
    });
}

function getCardByOid(session , oids, callback) {
        var insert = new Promise(function (resolve, reject) {
            session.get(oids, function (error, varbinds) {
                if (error) {
                    reject(error)
                } else {
                    resolve(varbinds);
                }
            });
        });

         insert.then(function (varbinds) {
            var card = new Card;
             if (snmp.isVarbindError (varbinds[0]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.name = varbinds[0].value.toString().trim();

             if (snmp.isVarbindError (varbinds[1]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.type = varbinds[1].value.toString().trim();

             if (snmp.isVarbindError (varbinds[2]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.sw_version = varbinds[2].value.toString().trim();

             if (snmp.isVarbindError (varbinds[3]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.alarm_status = varbinds[3].value.toString().trim();

             if (snmp.isVarbindError (varbinds[4]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.hw_status = varbinds[4].value.toString().trim();

             if (snmp.isVarbindError (varbinds[5]))
                 console.error (snmp.varbindError (varbinds[i]))
             else
                 card.activity = varbinds[5].value.toString().trim();
            return callback(card, null);
        }).catch(function (err) {
            callback(null, err)
         });
}



exports.getDetailVoiceCard = function (req, res) {

    // Default options
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(req.params.ip_address, "public", options);

    var list = [];

    // VoiceFaxIdx, Trans , Recieve, Type, Echo, Speed
    var oids = ["1.3.6.1.4.1.164.3.6.3.4.1.1.2.","1.3.6.1.4.1.164.3.6.3.4.1.1.4.","1.3.6.1.4.1.164.3.6.3.4.1.1.5.",
        "1.3.6.1.4.1.164.3.6.3.4.1.1.6.", "1.3.6.1.4.1.164.3.6.3.4.1.1.8.","1.3.6.1.4.1.164.3.6.3.4.1.1.9."];
    var data = [];

    for(var i = 901; i <= 902; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }

    for(var i = 1001; i <= 1002; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }
    for(var i = 1301; i <= 1302; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }

    for(var i = 1401; i <= 1402; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }

    async.eachSeries(data,function (oid, callback) {
        getDetailCard(session, oid, function (result, err) {
            if(!err) {
                list.push(result);
                callback();
            } else {
                callback(err)
            }

        });
    }, function (err) {
        if(err) {
            session.close();
            res.json({
                code: 0,
                result: err
            })
        } else {
            session.close();
            res.json({
                code: 1,
                result: list
            })
        }
    });

}

exports.getDetailDataCard = function (req, res) {
    // Default options
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(req.params.ip_address, "public", options);

    var list = [];

    // 2-DataIdx, 3-DataSlt , 4-ComProtocl, 5- dataLen, 6-Timing, 7-CtrSignal, 8-CtsSignal, 9-RtsCtsDelay, 11- Speed

    var oids = ["1.3.6.1.4.1.164.3.6.3.2.1.1.2.","1.3.6.1.4.1.164.3.6.3.2.1.1.3.","1.3.6.1.4.1.164.3.6.3.2.1.1.4.",
    "1.3.6.1.4.1.164.3.6.3.2.1.1.5.","1.3.6.1.4.1.164.3.6.3.2.1.1.6.","1.3.6.1.4.1.164.3.6.3.2.1.1.7.",
    "1.3.6.1.4.1.164.3.6.3.2.1.1.8.","1.3.6.1.4.1.164.3.6.3.2.1.1.9.","1.3.6.1.4.1.164.3.6.3.2.1.1.11."];
    var data = [];

    for(var i = 701; i <= 702; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }

    for(var i = 801; i <= 802; i++) {
        var item = oids.map(x => x+"1."+i)
        data.push(item);
    }
    async.eachSeries(data,function (oid, callback) {
        getDetailCard(session, oid, function (result, err) {
            if(!err) {
                list.push(result);
                callback();
            } else {
                callback(err)
            }

        });
    }, function (err) {
        if(err) {
            session.close();
            res.json({
                code: 0,
                result: err
            })
        } else {
            session.close();
            res.json({
                code: 1,
                result: list
            })
        }
    });

}

exports.getMainLinkCard = function (req, res) {
    // Default options
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(req.params.ip_address, "public", options);

    var list = [];
    var oids = ["1.3.6.1.4.1.164.3.6.3.1.2.1.3.","1.3.6.1.4.1.164.3.6.3.1.2.1.4.","1.3.6.1.4.1.164.3.6.3.1.2.1.5.",
        "1.3.6.1.4.1.164.3.6.3.1.2.1.6.", "1.3.6.1.4.1.164.3.6.3.1.2.1.7."];
    var data = [];

    for(var i = 1; i <= 1; i++) {
        var item = oids.map(x => x+"1.301")
        data.push(item);
    }
    async.eachSeries(data,function (oid, callback) {
        getDetailCard(session, oid, function (result, err) {
            if(!err) {
                list.push(result);
                callback();
            } else {
                callback(err);
            }
        });
    }, function (err) {
        if(err) {
            session.close();
            res.json({
                code: 0,
                result: err
            })
        } else {
            session.close();
            res.json({
                code: 1,
                result: list
            })
        }
    });
}

exports.getDateTime = function (req, res) {
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(req.params.ip_address, "public", options);

    var oids = ["1.3.6.1.4.1.164.3.3.1.3.2.0","1.3.6.1.4.1.164.3.3.1.3.3.0"];

    session.get (oids, function (error, varbinds) {
        if (error) {
            res.json({
                code: 0,
                result:error
            })
        } else {
            var data = {
                date: varbinds[0].value.toString(),
                time: varbinds[1].value.toString(),
            }
            session.close();
            res.json({
                code: 1,
                result: data
            })
        }
    });
}

function getDetailCard(session, oid, callback) {
    var pro = new Promise(function (resolve, reject) {
        session.get(oid, function (error, varbinds) {
            if (error) {
                reject(error);
            } else {
                resolve(varbinds);
            }
        });
    });

    pro.then(function (varbinds) {
        return callback(varbinds, null);
    }).catch(function (err) {
       callback(null, err)
    });
}