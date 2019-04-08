var socket = io();

socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
});

$('#reset').click(function() {
    socket.emit('reset');
});
var localUser = localStorage.getItem('username');

$(document).ready(function(){
    if(localUser == null){
        $('#modalName').modal('show');
    }
    console.log('localuser:' + localUser);
    $('#okBtn').on('click', function(){
        //check if they put name on it:
        let tempVal = $('#usr').val();
        if(tempVal != ''){
            console.log('put value on it');
        }else{
            console.log('mother f* didnt put name');
        }
        //localStorage.setItem('username', )
    });
});