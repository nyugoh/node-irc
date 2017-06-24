
var name,
    isNameSet = false,
    socket = io();


setInterval(setTime, 1000);

if(!isNameSet){
    setName();
    console.log('not set')
}




// FUNCTIONS
/***
    Update the time om the header
*/
function setTime() {
    var date = new Date(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();

        sec < 10 ? sec ='0' + sec : sec = sec;
        min < 10 ? min = '0' + min : min = min;
        time = hour + ':' + min + ':' + sec;
        $('#time').text(time);
}

// Set the name
function setName() {
    //Show the name form
    $('#login-form').submit((event)=>{
        event.preventDefault();

        name = $('#name').val();
        if(name.trim().length > 2){
            isNameSet = true;
            $('#feedback').html('');
            //Remove the name form
            $('#login-form').addClass("hidden")
            // Show the message form
            $('#message-form').removeClass("hidden")

            //emit a join event
            socket.emit('join', {name : name, id : socket.id});

            // Update the UI
            $('#username').text(name);
        }else{
            $('#feedback').html('<div class="alert alert-danger"><p class="notifications text-center">Name should be at least 3 letters.</p><div>')
        }
    })
}


// Handle the message sent
$('#message-form').submit((e)=>{
    e.preventDefault();
    //Clear the message box
    $('#feedback').html('');

    console.log('message time')
    message = $('#message').val();
    if(message.trim().length !== 0){
        // broadcast the message
        socket.emit('chat', {chat : message, id : socket.id})
    }
})

socket.on('chat', (data)=>{
    if(data.senderId == socket.id){
        // You had sent the message
        $('#message-box').append('<div class="pull-right yours">'
            + '<p class="text">' + data.chat + '</p>'
            + '<span class="name"><b>' + data.names[data.ids.indexOf(socket.id)] + '</b></span>'
        + '</div>')
    }else{
        // Not your messge
        $('#message-box').append('<div class="others">'
            + '<span class="name"><b>' + data.names[data.ids.indexOf(data.senderId)] + '</b></span>'
            + '<p class="text">' + data.chat + '</p>'
        + '</div>')
    }
})


socket.on('new member', (data)=>{
    //update the llist of people online
    var users = '';
    for (var i = 0; i < data.ids.length; i++) {
        users +='<a class="list-group-item" href="'+ data.ids[i] + '">'+ data.names[i] +'</a>';
    }
    $('#online').html(users);
    $('#totalOnline').text(data.ids.length);


});
