var socket = io();

socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
});

$('#reset').click(function() {
    socket.emit('reset');
});