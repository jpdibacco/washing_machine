var socket = io();
var connected = false;
var localUser = localStorage.getItem('username'), tempVal;
var realstatus = false;
//time selector
var slider = document.getElementById("timeSelector");
var output = document.getElementById("timetoShow");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value + ' mins';
}
//get current date:
var dateTime;
var getCurrent = function () {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
}
var postItem = function (val) {
    var data = { name: val };
    $.ajax({
        type: 'POST',
        url: '/user',
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //show content
            console.log('Success!' + data);
            $('#modalName').modal('hide');
        },
        error: function (jqXHR, textStatus, err) {
            //show error message
            console.log('text status ' + textStatus + ', err ' + err)
        }
    });
}
var postTime = function (val, user) {
    let data = { time: val, user: user };
    $.ajax({
        type: 'POST',
        url: '/time',
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //hide the time scroll and ok btn
            console.log('time sent!', data);
            $('#showTime').hide();
            $('#cancel').show();
            console.log('are u sending localuser?' + user);
        },
        error: function (err) {
            //show erro
            console.log('error:' + err);
        }
    });
}
var postCancel = function (val) {
    let data = { status: val };
    $.ajax({
        type: 'POST',
        url: '/cancel',
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //hide the time scroll and ok btn
            console.log('time sent!', data);
            $('#showTime').show();
            $('#cancel').hide();
        },
        error: function (err) {
            //show erro
            console.log('err ' + err);
        }
    });
}
// // add last user:
// var postLastUser = function (val) {
//     var data = { name: localUser, date: val };
//     $.ajax({
//         type: 'POST',
//         url: '/lastuser',
//         timeout: 2000,
//         data: JSON.stringify(data),
//         contentType: 'application/json; charset=utf-8',
//         success: function (data) {
//             //show content
//             console.log('Success!' + data);
//             //$('#modalName').modal('hide');
//         },
//         error: function (jqXHR, textStatus, err) {
//             //show error message
//             console.log('text status ' + textStatus + ', err ' + err)
//         }
//     });
// }

$(document).ready(function () {
    if (localUser == null || localUser == undefined) {
        $('#modalName').modal('show');
    } else {
        $('#showToast').toast('show');
        $('#insertuser').text(localUser);
    }
    console.log('localuser:' + localUser);
    $('#okBtn').on('click', function () {
        //check if they put name on it:
        tempVal = $('#usr').val();
        if (tempVal != '') {
            postItem(tempVal);
            localStorage.setItem('username', tempVal);
        } else {
            console.log('mother f* didnt put name');
        }
    });
    $('#gobtn').on('click', function () {
        console.log('clicked ok GO!')
        let timeselector = $('#timeSelector').val();
        timeselector = timeselector * 60;
        localUser = localStorage.getItem('username');
        if (localUser != null && connected == true && localUser != undefined) {
            //we emit current user and status as false
            console.log('main validator is working');
            //socket.emit('currentUserclient', localUser, false);
            postTime(timeselector, localUser);
        } else {
            $('#showAlert').show();
        }
    });
    $('#cancel').on('click', function () {
        postCancel(false);
    });
    socket.on('connect', function () {
        console.log('you are connected');
        connected = true;
    });
    socket.on('timer', function (data) {
        $('#counter').html(data.countdown);
    });
    socket.on('status', function (data) {
        console.log('whats data.status: ' + data.status);
        if (data.status == false) {
            $('.toggle').addClass('off');
            $('#showTime').hide();
            realstatus = false;
        } 
        if(data.status == true) {
            $('.toggle').removeClass('off');
            $('#showTime').show();
            $('#cancel').hide();
            realstatus = true;
        }
    });
    //show or hide cancel btn for otherusers
    socket.on('currentUser', function (data) {
        console.log('current user: ' + data.currentuser);
        $('#currentUser').text(data.currentuser);
        if(localUser == data.currentuser && realstatus == false){
            $('#cancel').show();
        }
    });
});