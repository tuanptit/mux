$(document).ready(function () {
    var ip_address = $('#mux-ip').text();
    var mux_name = $('#mux-name').text();
    var cards;
    var card_voice = [];
    var main_link;
    var date;


    var ajax1 = $.ajax('/monitoring/'+ip_address, {
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
            cards = [];
            for (var i = 0; i < res.result.length; i++) {
                cards.push(res.result[i]);
            }
            appendToTable(cards);
        }
        else {
            showNoti(3, "Cannot connect to KILOMUX")
        }
    }).error(function (err) {
        console.log(err);
    });


    var ajax2 = $.ajax('/card/voice/'+ip_address, {
        method: 'GET'
    }).success(function (res) {
        if (res.code == '1') {
            for (var i = 0; i < res.result.length; i++) {
                var item = res.result[i];
                var tmp = {
                    name: item[0].value,
                    tx: item[1].value,
                    rx: item[2].value,
                    wire: item[3].value,
                    echo: item[4].value,
                    speed: item[5].value
                }

                card_voice.push(tmp);
            }
        }
        else {
            console.log(res.code);
        }
    }).error(function (err) {
        console.log(err);
    });

    var ajax3 = $.ajax('/card/data/'+ip_address, {
        method: 'GET'
    }).success(function (res) {
        if (res.code == '1') {
            for (var i = 0; i < res.result.length; i++) {
                var item = res.result[i];
                var tmp = {
                    name: item[0].value,
                    card_slt: item[1].value,
                    com_protocol: item[2].value,
                    async_data: item[3].value,
                    timing: item[4].value,
                    ctr_signal: item[5].value,
                    cts_signal: item[5].value,
                    delay: item[6].value,
                    speed: item[8].value,
                }
                card_voice.push(tmp);
            }
        }
        else {
            console.log(res.code);
        }
    }).error(function (err) {
        console.log(err);
    });

    var ajax4 = $.ajax('/card/mainlink/'+ip_address, {
        method: 'GET'
    }).success(function (res) {
        if (res.code == '1') {
            var item = res.result[0];
            main_link = {
                slot: item[0].value,
                timing: item[1].value,
                buffer_size: item[2].value,
                dsr_cts: item[3].value,
                speed: item[4].value
            }
            if(main_link.slot == 103) {
                main_link.slot = "kmxMlA"
            } else {
                main_link.slot = "kmxMlB"
            }
            if(main_link.timing == 7) {
                main_link.timing = "adaptive"
            } else if(main_link.timing == 6) {
                main_link.timing = "lbt"
            } else if(main_link.timing == 5) {
                main_link.timing = "int"
            } else if(main_link.timing == 4) {
                main_link.timing = "eDce"
            } else if(main_link.timing == 3) {
                main_link.timing = "dce"
            } else if(main_link.timing == 2) {
                main_link.timing = "dte"
            } else {
                main_link.timing = "notApplicable"
            }

            if(main_link.buffer_size == 3) {
                main_link.buffer_size = "bits256"
            } else if(main_link.buffer_size == 2) {
                main_link.buffer_size = "bits8"
            } else {
                main_link.buffer_size = "notApplicable"
            }

            if(main_link.dsr_cts == 3) {
                main_link.dsr_cts = "external"
            } else if(main_link.dsr_cts == 2) {
                main_link.dsr_cts = "internal"
            } else {
                main_link.dsr_cts = "notApplicable"
            }

            if(main_link.speed == 2) {
                main_link.speed = "bps9600"
            } else if(main_link.speed == 3) {
                main_link.speed = "bps14400"
            }
            else if(main_link.speed == 4) {
                main_link.speed = "bps19200"
            }
            else if(main_link.speed == 5) {
                main_link.speed = "bps28800"
            }
            else if(main_link.speed == 6) {
                main_link.speed = "bps32000"
            }
            else if(main_link.speed == 7) {
                main_link.speed = "bps48000"
            }
            else if(main_link.speed == 8) {
                main_link.speed = "bps56000"
            }
            else if(main_link.speed == 9) {
                main_link.speed = "bps64000"
            }
            else if(main_link.speed == 10) {
                main_link.speed = "bps128000"
            }
            else if(main_link.speed == 11) {
                main_link.speed = "bps192000"
            }
            else if(main_link.speed == 12) {
                main_link.speed = "bps256000"
            }
            else if(main_link.speed == 13) {
                main_link.speed = "bps384000"
            }
            else if(main_link.speed == 14) {
                main_link.speed = "bps512000"
            }else if(main_link.speed == 15) {
                main_link.speed = "bps768000"
            }
            else if(main_link.speed == 16) {
                main_link.speed = "bps1024000"
            }
            else if(main_link.speed == 17) {
                main_link.speed = "bps1536000"
            }
        }
        else {
            console.log(res.code);
        }
    }).error(function (err) {
        console.log(err);
    });

    var ajax5 = $.ajax('/time/'+ip_address, {
        method: 'GET'
    }).success(function (res) {
        if (res.code == '1') {
            var data = res.result.date+":"+res.result.time;
            date = new Date(data);
            updateTime(date);
        }
        else {
            console.log(res.code);
        }
    }).error(function (err) {
        console.log(err);
    });



    var channel;
    var mux_type = $("#mux-type").text();
    $.when(ajax1, ajax2, ajax3, ajax4, ajax5).done(function (result1, result2, result3, result4, result5) {
        // slot 1 2 card 1
        var s1c1 = card_voice[0];
        var s2c1 = card_voice[1];

        var slot1_card1 = getSlotDataCard(s1c1);
        var slot2_card1 = getSlotDataCard(s2c1);

        $("#card6 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 1 CONFIGURATION</h6>");

        console.log(mux_type)
        if(mux_type == 0) {
            channel = "AFTN PVHK"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "AFTN TWR"
        }

        $("#card6 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        fillDetailDataCard(6, slot1_card1);
        $("#card6 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 2 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "AFTN DHC"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "CHANNEL EMPTY"
        }

        $("#card6 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");

        fillDetailDataCard(6, slot2_card1);


        // slot 1 2 card 2
        var s1c2 = card_voice[2];
        var s2c2 = card_voice[3];

        var slot1_card2 = getSlotDataCard(s1c2);
        var slot2_card2 = getSlotDataCard(s2c2);

        $("#card7 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 1 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "AFTN TTB"
        }
        $("#card7 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        fillDetailDataCard(7, slot1_card2);
        $("#card7 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 2 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "AFTN AWOS"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "CHANNEL EMPTY"
        }
        $("#card7 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        fillDetailDataCard(7, slot2_card2);
        console.log(card_voice);



    //    VOICE CARD

    //    slot 1 2 card 1
        var s1v1 = card_voice[4];
        var s2v1 = card_voice[5];

        //chuan hoa data
        var slot1_voice1 = getSlotVoiceCard(s1v1)
        var slot2_voice1 = getSlotVoiceCard(s2v1);

    //     fill vao table
    //        card1
        $("#card8 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 1 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "HOTLINE VISAT"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "HOTLINE VNPT"
        }
        $("#card8 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        fillDetailVoiceCard(8,slot1_voice1);



        if(mux_type == 0) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "CHANNEL EMPTY"
        }
        $("#card8 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        $("#card8 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 2 CONFIGURATION</h6>");
        fillDetailVoiceCard(8,slot2_voice1);

    //     card 2
        //    slot 1 2 card 2
        var s1v2 = card_voice[6];
        var s2v2 = card_voice[7];

        //chuan hoa data
        var slot1_voice2 = getSlotVoiceCard(s1v2)
        var slot2_voice2 = getSlotVoiceCard(s2v2);

        $("#card9 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 1 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "8884"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "CHANNEL EMPTY"
        }
        $("#card9 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");

        fillDetailVoiceCard(9,slot1_voice2);
        $("#card9 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>SLOT 2 CONFIGURATION</h6>");

        if(mux_type == 0) {
            channel = "8887"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 2) {
            channel = "8883"
        }
        $("#card9 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
        fillDetailVoiceCard(9,slot2_voice2);

        if(mux_type == 2) {
            channel = "ATM"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 0) {
            channel = "CHANNEL EMPTY"
        }
        $("#card10 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");


        if(mux_type == 2) {
            channel = "ADSB"
        } else if(mux_type == 1) {
            channel = "CHANNEL EMPTY"
        } else if(mux_type == 0) {
            channel = "CHANNEL EMPTY"
        }

        $("#card11 .table-responsive").append("<h6 class='panel-title text-center label label-warning channel-name' style='float: right;'>"+channel+"</h6>");
    //    MAIN LINK
        console.log(main_link)
        fillDetailMainLinkCard(main_link);


    });
});

function fillDetailMainLinkCard(data) {
    $("#card2 .table-responsive").append("<h6 class='panel-title text-center label label-primary'>CARD CONFIGURATION</h6>");
    $("#card2 .table-responsive").append("<table class='table table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>SPEED</th><th class='text-center'>TIMING</th>"+
        "<th class='text-center'>BUFFER_SIZE</th><th class='text-center'>DSR&CTS</th>"+
        "</tr>"+
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td class='text-center'><span class='label label-info'>"+ data.speed+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+data.timing+"</span></td>" +
        "<td class='text-center'><span class='label label-info'>"+data.buffer_size+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+data.dsr_cts+"</span></td>" +

        "</tr>" +
        "</tbody>"+

        "</table>");
}

function fillDetailVoiceCard(card, slot) {
    $("#card"+card+" .table-responsive").append("<table class='table table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>SPEED</th><th class='text-center'>TX_LEVEL</th>"+
        "<th class='text-center'>RX_LEVEL</th><th class='text-center'>ECHO</th>"+
        "</tr>"+
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td class='text-center'><span class='label label-info'>"+slot.speed+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+slot.tx+"</span></td>" +
        "<td class='text-center'><span class='label label-info'>"+slot.rx+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+slot.echo+"</span></td>" +

        "</tr>" +
        "</tbody>"+

        "</table>");
}

function fillDetailDataCard(card, slot1_card1) {
    $("#card"+card+" .table-responsive").append("<table class='table table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Speed</th><th class='text-center'>Protocol</th>"+
        "<th class='text-center'>ASYNC_DATA</th><th class='text-center'>TIMING</th>"+
        "<th class='text-center'>CTRL_SIG</th><th class='text-center'>CTS</th>" +
        "<th class='text-center'>RTS_CTS_DEL</th>"+
        "</tr>"+
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td class='text-center'><span class='label label-info'>"+slot1_card1.speed+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+slot1_card1.protocol+"</span></td>" +
        "<td class='text-center'><span class='label label-info'>"+slot1_card1.async_data+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+slot1_card1.timing+"</span></td>" +
        "<td class='text-center'><span class='label label-info'>"+slot1_card1.ctr_signal+"</span></td>" +
        "<td class='text-center'><span class='label label-success'>"+slot1_card1.cts_signal+"</span></td>" +
        "<td class='text-center'><span class='label label-info'>"+slot1_card1.delay+"</span></td>" +
        "</tr>" +
        "</tbody>"+

        "</table>");
}

function getSlotDataCard(data) {
    var item = {
        protocol: "",
        async_data: "",
        timing:"",
        ctr_signal: "",
        cts_signal: "",
        delay: "",
        speed: ""
    };

    // protocol
    if(data.com_protocol == 2) {
        item.protocol = "async"
    } else if(data.com_protocol == 3) {
        item.protocol = "sync"
    } else {
        item.protocol = "notApplicable"
    }

    // async_data
    if(data.async_data == 5) {
        item.async_data = "bit9"
    } else if(data.async_data == 4) {
        item.async_data = "bit8"
    }else if(data.async_data == 3) {
        item.async_data = "bit7"
    }else if(data.async_data == 2) {
        item.async_data = "bit6"
    } else {
        item.async_data = "notApplicable";
    }

    // timing
    if(data.timing == 4) {
        item.timing = "DTE2"
    } else if(data.timing == 3) {
        item.timing = "DTE1"
    } else if(data.timing == 2) {
        item.timing = "DCE"
    } else {
        item.timing = "notApplicable"
    }
//    CTRL signal
    if(data.ctr_signal == 4) {
        item.ctr_signal = "RTS"
    }else if(data.ctr_signal == 3) {
        item.ctr_signal = "dtrAndRts"
    } else if(data.ctr_signal == 2) {
        item.ctr_signal = "Local"
    } else {
        item.ctr_signal = "notApplicable"
    }

//    CTS signal
    if(data.cts_signal == 3) {
        item.cts_signal = "on"
    } else if(data.cts_signal == 2) {
        item.cts_signal = "=RTS"
    } else {
        item.cts_signal = "notApplicable";
    }

//    delay
    if(data.delay == 6) {
        item.delay = "ms200"
    } else if(data.delay == 5) {
        item.delay = "ms100"
    }
    else if(data.delay == 4) {
        item.delay = "ms50"
    }
    else if(data.delay == 3) {
        item.delay = "ms10"
    }
    else if(data.delay == 2) {
        item.delay = "min"
    } else {
        item.delay ="notApplicable";
    }

//    speed
    if(data.speed == 1) {
        item.speed = "notConnected"
    } else if (data.speed == 2) {
        item.speed = "bps300"
    } else if (data.speed == 3) {
        item.speed = "bps600"
    }
    else if (data.speed == 4) {
        item.speed = "bps1200"
    }
    else if (data.speed == 5) {
        item.speed = "bps2400"
    }
    else if (data.speed == 6) {
        item.speed = "bps4800"
    }
    else if (item.speed == 7) {
        item.speed = "bps7200"
    }
    else if (data.speed == 8) {
        item.speed = "bps8000"
    }else if (data.speed == 9) {
        item.speed = "bps9600"
    }
    else if (data.speed == 10) {
        item.speed = "bps12000"
    } else {
        item.speed = ">12000"
    }
    return item;

}

function getSlotVoiceCard(data) {
    var item = {
        tx: "",
        rx: "",
        wire:"",
        echo:"",
        speed:""
    }
    item.tx = data.tx - 50+"dbm";
    item.rx = data.rx - 50+"dbm";
    if(data.echo == 3) {
        item.echo = "on"
    } else if(data.echo == 2) {
        item.echo = "off"
    } else {
        item.echo = "notApplicable"
    }
    if(data.speed == 1) {
        item.speed = "notConnected"
    } else if (data.speed == 2) {
        item.speed = "bps4800"
    }
    else if (data.speed == 3) {
        item.speed = "bps6400"
    }else if (data.speed == 4) {
        item.speed = "bps7200"
    }
    else if (data.speed == 5) {
        item.speed = "bps8000"
    }
    else if (data.speed == 6) {
        item.speed = "bps9600"
    }
    else if (data.speed == 7) {
        item.speed = "bps12800"
    }
    else if (data.speed == 8) {
        item.speed = "bps16000"
    }
    else if (data.speed == 9) {
        item.speed = "bps24000"
    }
    else if (data.speed == 10) {
        item.speed = "bps32000"
    }
    else if (data.speed == 11) {
        item.speed = "bps64000"
    }
    else {
        item.speed = "bps11200"
    }
    return item;
}

function modifyVoiceCard(data) {
    // console.log(data);
}

function appendToTable(data) {
    var data_name = ["Power Supply A", "Power Supply B", "Kilomux Main Link A", "Kilomux Main Link B", "Kilomux Common Logic - KCL",
        "Option Module","Kilomux IO 1 - Kilomux Low Speed", "Kilomux IO 2 - Kilomux Low Speed","Kilomux IO 3 - Kilomux Voice Card","Kilomux IO 4 - Kilomux Voice Card","Kilomux IO 5 -  KMBE","Kilomux IO 6 - KMBE","Kilomux IO 7",
        "Kilomux IO 8","Kilomux IO 9","Kilomux IO 10","Kilomux IO 11","Kilomux IO 12"];
    var data_type = ["psAC","kML1","kCLEth","kLS1New","kVC1MFxs","kVC1MFxo","kMBENew","Empty","kVC1MEM"];
    for(var i = 0; i < data.length; i++) {

        data[i].indentify = data[i].name
        data[i].name = data_name[i];

        if(data[i].type == "10") {
            data[i].type = data_type[0];
        }

        if(data[i].type == "50") {
            data[i].type = data_type[1];
        }

        if(data[i].type == "2") {
            data[i].type = data_type[7];
        }

        if(data[i].type == "24") {
            data[i].type = data_type[2]
        }

        if(data[i].type == "71") {
            data[i].type = data_type[3]
        }

        if(data[i].type == "135") {
            data[i].type = data_type[4]
        }

        if(data[i].type == "134") {
            data[i].type = data_type[5]
        }

        if(data[i].type == "82") {
            data[i].type = data_type[6]
        }

        if(data[i].type == "133") {
            data[i].type = data_type[8]
        }

    //    activity
        if(data[i].activity == "1") {
            data[i].activity = "notApplicable"
        } else if(data[i].activity =="2") {
            data[i].activity = "offline"
        } else {
            data[i].activity = "online"
        }
    //    hardware status
        if(data[i].hw_status == 2) {
            data[i].hw_status = "fail";
        } else if(data[i].hw_status == 3) {
            data[i].hw_status = "ok";
        }

    //    alarm status
        if(data[i].alarm_status == 2) {
            data[i].alarm_status = "off"
        }
        if(data[i].alarm_status == 3) {
            data[i].alarm_status = "major"
        }
        if(data[i].alarm_status == 4) {
            data[i].alarm_status = "minor"
        }
        if(data[i].alarm_status == 5) {
            data[i].alarm_status = "event"
        }
        if(data[i].alarm_status == 6) {
            data[i].alarm_status = "warning"
        }
        if(data[i].alarm_status == 7) {
            data[i].alarm_status = "critical"
        }
        if(data[i].activity=="online") {
            $("#list-card").append("<div class='panel panel-default'><div class='panel-heading'>" +
                "<h6 class='panel-title panel-trigger'><h6 class='panel-title panel-trigger'>" +
                "<a data-toggle='collapse' card='"+data[i].indentify+"' href='#card"+i+"' class='collapsed card-name'>"+data[i].name+"</a></h6></div>" +
                "<div id='card"+i+"' card='"+data[i].indentify+"' class='panel-collapse collapse' style='height: 0px;'><div class='panel-body'>"+
                " <div class='table-responsive'>" +
                "<h6 class='panel-title text-center label label-primary'>CARD STATUS</h6>"+
                "<table class='table table-bordered'>" +
                "<thead>" +
                "<tr>" +
                "<th class='text-center'>Hardware Status</th>" +
                "<th class='text-center'>Alarm Status</th>" +
                "<th class='text-center'>Software Version</th>" +
                "<th class='text-center'>Card Type</th>"+
                "</tr>" +
                "</thead>"+
                "<tbody>" +
                "<tr>" +
                "<td class='text-center'><span class='label label-info'>"+data[i].hw_status+"</span></td>" +
                "<td class='text-center'><span class='label label-success alarm-status'>"+data[i].alarm_status+"</span></td>" +
                "<td class='text-center'><span class='label label-info'>"+data[i].sw_version+"</span></td>" +
                "<td class='text-center'><span class='label label-success'>"+data[i].type+"</span></td>" +
                "</tr>" +

                "</tbody>"
                +"</div>");
        }

    }
    $('.alarm-status').each(function (i,obj) {
        if($(obj).text()!="off") {
            $(obj).removeClass('label-success').addClass('label-danger');
        }
    });
    // return data;

    //delete alarm
    $('#btn-delete-buffer').click(function(){
        console.log('delete');
        var ip_address = $('#mux-ip').text();
        var ajax2 = $.ajax('/delete/buffer/'+ip_address, {
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
            if(res.code == 1) {
                console.log('1')
                showNoti(4,"Delete Buffer Alarm Successfully");
                setTimeout(reload, 3000)
            }

        }).error(function (err) {
            console.log(err);
        });
    });

}

function reload() {
    location.reload();
}
function showNoti(type, text) {
    if (type == 1) {
        Lobibox.notify('info', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else if (type == 2) {
        Lobibox.notify('warning', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else if (type == 3) {
        Lobibox.notify('error', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else {
        Lobibox.notify('success', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
}

function updateTime(date){
    var up_date = new Date(date);
    up_date.setSeconds(date.getSeconds()+1);
    $("#time").text(up_date.toString().substring(0,25));
    setTimeout(function(){updateTime(up_date)}, 1000);
}