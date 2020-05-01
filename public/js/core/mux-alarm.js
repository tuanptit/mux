$(document).ready(function () {
    $("#get-alarm").on('click', function () {
        var ip_address = $('#mux-ip').text();
        var ajax1 = $.ajax('/alarm/'+ip_address, {
            method: 'GET',
            beforeSend: function (){
                $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                $('.overlay').fadeIn(150);
            }
        }).success(function (res) {
            window.setTimeout(function(){
                $('.overlay').fadeOut(150, function() {
                    $(this).remove();
                });
            },50);

            if (res.code == '1') {
                var data = (res.result);
                appendToTableAlarm(correctData(data));
                $('.alarm-status').each(function (i,obj) {
                    if($(obj).text()!="off") {
                        $(obj).removeClass('label-success').addClass('label-danger');
                    }
                });
            }
            else {
                showNoti(3, "Cannot connect to KILOMUX")
            }
            $("#get-alarm").off('click');
        }).error(function (err) {
            console.log(err.toString());
        });
    });
});

function appendToTableAlarm(data) {
    // console.log(data)
    for(var i = 0 ; i < data.length; i++) {
        $('#body-alarm').append(
            "<tr>" +
                "<th class='text-center'><span class='label label-info'>"+data[i].index+"</span></th>" +
                "<th class='text-center'><span class='label label-warning'>"+data[i].code+"</span></th>" +
                "<th class='text-center'><span class='label label-info alarm-status'>"+data[i].state+"</span></th>" +
                "<th class='text-center'><span class='label label-success'>"+data[i].slot+"</span></th>" +
                "<th class='text-center'><span class='label label-default'>"+data[i].date+"</span></th>" +
                "<th class='text-center'><span class='label label-default'>"+data[i].time+"</span></th>" +
            "</tr>");
    }


}
function correctData(data) {
    var list = [];
    for(var i = data.length; i--; i>=0) {
        var item = {
            index:"",
            code:"",
            state:"",
            slot:"",
            date:"",
            time:""
        }
        item.index = data[i][0];
        item.code = getAlarmCode(data[i][1]);
        item.state = getAlarmState(data[i][2]);
        item.slot = getSlot(data[i][3]);
        item.date = data[i][5];
        item.time = data[i][6];
        list.push(item);
    }
    return list;
}
function getAlarmCode(code) {
    var message = ["","HARDWARE FAILURE SLOT i","LOCAL SYNC LOSS","B.R.G FAILURE, SLOT i","PS-A 5V FAILURE","PS-A 12V FAILURE",
        "PS-B 5V FAILURE","PS-B 12V FAILURE","DB 1 CHKSUM ERROR - DB 2 CHKSUM ERROR","DB 1 CHKSUM ERROR - DB 2 CHKSUM ERROR",
        "BANDWIDTH OVERFLOW","ALARM BUFFER OVERFLOW","CLOCK WAS CHANGED TO FALLBACK","CLOCK WAS CHANGED TO INTERNAL","CL HARDWARE FAILURE","",
        "POWER SUPPLY A REMOVED","I/O SYNC LOSS, SLOT i ","MAIN LINK FLIP OCCURRED","ML LOSS OF SIGNAL, SLOT i","MODULE WAS REMOVED, SLOT i",
    "MAIN LINK BACKUP DIAL FAILURE","SWITCHED BACKUP ML IS ACTIVE ","MAIN LINK RECOVERY","MAIN LINK FLIP, ML-A","MAIN LINK FLIP, ML-B",
        "DATABASE SWITCH TO DB1","DATABASE SWITCH TO DB2","PSWRD SWITCH IS ON","POWER SUPPLY B REMOVED","DB-INIT SWITCH IS ON","REAL TIME CLOCK BATTERY FAILURE",
        "VOICE SYNC LOSS, CH ","TAIL-END MODEM ON LOOP, CH","","IDLE SEQUENCE, SLOT i ","ML OUT OF SERVICE, SLOT i","ML OUT OF FRAME, SLOT i ","DSU LOOPBACK, SLOT i ",
        "KTRE/KMBE LINK ERROR SLOT i","KTRE/KMBE LAN ERROR, SLOT i ","KDI FRAME OVERFLOW","PIGGY-BACK HARDWARE ERROR A ","NETWORK LLB, SLOT i ",
        "NETWORK PLB, SLOT i ","DRIVER FAIL, SLOT i ","SIGNAL LOSS, SLOT i ","EXCESSIVE BPV, SLOT i","AIS OCCURRED, SLOT i","AIS RED ALM, SLOT i ",
        "AIS SYNC LOSS,SLOT i ","RED ALARM, SLOT i ","E1 LOCAL SYNC LOSS, SLOT i","LOCAL MF S.LOSS, SLOT i","REMOTE MF S.LOSS, SLOT i","YELLOW ALARM, SLOT i ",
        "E1 REMOTE SYNC LOSS SLOT i ","FRAME SLIP, SLOT i ","BPV ERROR, SLOT i","EXCESSIVE ERR RATIO, SLOT i","CRC-4 ERROR, SLOT i","SFIFO B.R.G FAIL, SLOT i","SFIFO SLIP, SLOT i",
        "INTERNAL CLOCK IN USE","DP CYCLE DIAL FAILED ","DP PRIMARY CALL FAILED","DP ALTERNATE CALL FAILED","FRAMER CARD FAILED ","MGMT PORT IS LOOPED",
        "MGMT PORT IS DOWN","AGENTS WITH SAME NAME IN NET","CONTROL TAKEN BY SNMP MMI "," "," ","KCL WARE ERROR:KCL","HARDWARE ERROR:IO-i ","HARDWARE ERROR:ML-i",
        "ALARM BUFFER EMPTY"," ","RED ALARM, SLOT","YELLOW ALARM, SLOT","FRAME SLIP, SLOT:","BPV ERROR, SLOT","PHASOR OVERFLOW, SLOT","PORT SYNC LOSS, PORT ",
        "FANS FAILURE","PORT LOSS OF SIGNAL","OVERFLOW, PORT: ","VOICE SYNC LOSS, PORT","","SIGNAL LOSS, SLOT: ","AIS ALARM, SLOT: ","AIS RED ALARM, SLOT: ","","",
        "TDM DEVICE SLIP, PORT: ","REMOTE SYNC LOSS, PORT:","CCS COMPRESSION OVERFLOW PORT ","JITTER BUFFER UNDERFLOW","JITTER BUFFER OVERFLOW ",
        "SEQUENCE ERROR","FCS ERROR","ALIGNMENT ERROR","RINGER VOLTAGE FAILURE"];
    return message[code];
}
function getAlarmState(state) {
    if(state == 2) {
        return "off"
    } else if(state == 3) {
        return "event"
    }
    else if(state == 4) {
        return "minor"
    }
    else if(state == 5) {
        return "major"
    }
    else if(state == 6) {
        return "warning"
    }
    else {
        return "critical"
    }
}
function getSlot(slot) {
    var slot1 = ["psA","psB","clA","clB","io1","io2","io3","io4","io5","io6","io7",
        "io8","io9","io10","io11","io12","io13","io14","io15","local", "psC"];
    for(var i = 1; i<= 21; i++ ) {
        if(slot == i) {
            return slot1[i];
            break;
        }
    }
    var slot2 = ["kmxPsA","kmxPsB","kmxMlA","kmxMlB","kmxCl","kmxOpt","kmxIO1","kmxIO2","kmxIO3","kmxIO4","kmxIO5",
        "kmxIO6","kmxIO7","kmxIO8","kmxIO9","kmxIO10","kmxIO11","kmxIO12"];
    for(var i = 101; i <= 118; i++) {
        if(slot == i) {
            return slot2[i-101];
            break;
        }

    }
    if(slot == 120) {
        return "remote";
    }
    return "notApplicable"
}
