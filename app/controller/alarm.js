var snmp = require ("net-snmp");
var async = require('async');
var Alarm = require('../model/alarm');
exports.getAlarm = function (req, res) {

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
    var oid = "1.3.6.1.4.1.164.3.3.1.5.1";
    var maxRepetitions = 20;
    function sortInt (a, b) {
        if (a > b)
            return 1;
        else if (b > a)
            return -1;
        else
            return 0;
    }

    function responseCb (error, table) {
        if (error) {
            res.json({
                code: 0,
                result: error
            })
        } else {

            var indexes = [];
            for (index in table)
                indexes.push (parseInt (index));
            indexes.sort (sortInt);
            var list = [];
            for (var i = 0; i < indexes.length; i++) {
                var columns = [];
                for (column in table[indexes[i]])
                    columns.push (parseInt (column));
                columns.sort (sortInt);

                // console.log ("row for index = " + indexes[i]);
                var item = [];
                for (var j = 0; j < columns.length; j++) {
                    if(j>4) {
                        item.push(table[indexes[i]][columns[j]].toString());
                    } else {
                        item.push(table[indexes[i]][columns[j]]);
                    }
                }
                list.push(item);
            }
            session.close();
            res.json({
                code: 1,
                result: list
            })
        }
    }

    var maxRepetitions = 20;

    session.table (oid, maxRepetitions, responseCb);

}

exports.getAllAlarm = function (req, res) {
   Alarm.find({}).sort({_id: -1}).exec(function (error, alarms) {
       if(!error) {
           res.json({
               code: 1,
               result: alarms
           })
       }
   })
}

exports.deleteBufferAlarm = function (req, res) {
    var varbinds = [
        {
            oid: "1.3.6.1.4.1.164.3.3.1.5.2.0",
            type: snmp.ObjectType.INTEGER,
            value: 3
        }
    ];

    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 5000,
        version: snmp.Version1,
        idBitsSize: 32
    };
    var session = snmp.createSession(req.params.ip_address, "private", options);
    session.set (varbinds, function (error, varbinds) {
        if (error) {
            console.log(error.toString())
            session.close();
            res.json({
                code: 0,
                result: error
            })
        } else {
            console.log(varbinds)
            session.close();
            res.json({
                code: 1
            })
        }
    });

}