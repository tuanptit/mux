$(document).ready(function () {
    function getAllEmployees() {
        $.ajax('/getMux', {
            method: 'GET'
        }).success(function (res) {
            if (res.code == '0') {
                var listMux = res.result;
                fillMuxToSidebar(listMux);
            }
            else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function fillMuxToSidebar(muxs) {
        for(var i = 0; i < muxs.length; i++) {
            $("#dynamic-sidebar").prepend('<li><a href="/mux/'+muxs[i]._id+'">'+muxs[i].name+'</a></li>')
        }
    }
    getAllEmployees();
});

