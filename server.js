var snmp = require ("net-snmp");

var session = snmp.createSession ("192.168.1.75", "public");

var oids = ["1.3.6.1.4.1.164.3.3.2.1.1.1.1.101"];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }
    session.close ();
});