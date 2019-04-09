var socket = io();
socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
    if (data.countdown == 0) {
        // sending to the client
        socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    }
});

$('#reset').click(function () {
    socket.emit('reset');
});
var localUser = localStorage.getItem('username'), tempVal;
var postItem = function(val) {
    var data = {name: val};
    $.ajax({
        type: 'POST',
        url: '/user',
        timeout: 2000,
        data:JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            //show content
            console.log('Success!'+ data);
            $('#modalName').modal('hide');
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            console.log('text status '+textStatus+', err '+err)
        }
    });
}
$(document).ready(function () {
    if (localUser == null) {
        $('#modalName').modal('show');
    }
    console.log('localuser:' + localUser);
    $('#okBtn').on('click', function () {
        //check if they put name on it:
        tempVal = $('#usr').val();
        if (tempVal != '') {
            postItem(tempVal);
        } else {
            console.log('mother f* didnt put name');
        }
        localStorage.setItem('username', tempVal);
    });
});