
var name,
    isNameSet = false,
    socket = io();


setInterval(setTime, 1000);

if(!isNameSet){
    setName();
    console.log('not set')
}


socket.on('bootstraper', (data)=>{
    names = data;
})

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
        if(names.indexOf(name) !== -1){
            $('#feedback').html('<div class="alert alert-danger"><div><p class="notifications text-center">Username already taken.</p></div>')
        }else if(name.trim().length > 2){
            isNameSet = true;
            $('#feedback').html('');
            //Remove the name form
            $('#login-form').addClass("hidden")
            // Show the message form
            $('#message-form').removeClass("hidden")
            $('#message').focus()

            //emit a join event
            socket.emit('join', {name : name, id : socket.id});

            // Update the UI
            $('#username').text(name);
        }else{
            $('#feedback').html('<div class="alert alert-danger"><div><p class="notifications text-center">Name should be at least 3 letters.</p></div>')
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
        socket.emit('chat', {chat : cleanInput(message), id : socket.id})
        $('#message').val('')
        $('#message').focus()
    }
})
socket.on('chat', (data)=>{
    if(isNameSet){
        id = new Date().getTime()
        console.log(id)
        if(data.senderId == socket.id){
            // You had sent the message

            $('#message-box').append('<div id="'+ id +'" class="pull-right yours">'
                + '<p class="text">' + data.chat + '</p>'
                + '<span class="name"><b>' + data.names[data.ids.indexOf(socket.id)] + '</b></span>'
            + '</div>')
        }else{
            // Not your messge
            $('#message-box').append('<div '+ id +' class="others">'
                + '<span class="name"><b>' + data.names[data.ids.indexOf(data.senderId)] + '</b></span>'
                + '<p class="text">' + data.chat + '</p>'
            + '</div>')
        }
    }
     $('#tabs-box').animate({scrollTop: $('#tabs-box').prop("scrollHeight")}, 500);
    updateScroll($('#tabs-box').prop("scrollHeight"));

})



socket.on('new member', (data)=>{
    if(isNameSet && data.name != null){
        //update the llist of people online
        var users = '';
        for (var i = 0; i < data.ids.length; i++) {
            if(data.names[i] != null)
                users +='<a class="list-group-item" href="/#'+ data.ids[i] + '">'+ data.names[i] +'</a>';
        }
        $('#online').html(users);
        $('#totalOnline').text(data.clients);
        //Send an alert to the message box
        if(data.ids[data.names.indexOf(data.name)] == socket.id){
            if(data.clients == 1){
                $('#message-box').append('<div><p class="notifications text-center text-info">' + data.name + ', welcome to the IRC.<br>'
                +'Looks like you are alone ...</p></div>')
            }else {
                $('#message-box').append('<div><p class="notifications text-center text-info">' + data.name + ', welcome to the IRC.<br>'
                +'There are ' + data.clients +' participants online ...</p></div>')
            }
        }else{
            $('#message-box').append('<div><p class="notifications text-center text-info">' + data.name + ' has joined ...</p></div>')
        }
    }
});
socket.on('leave update', (data)=>{
    if(isNameSet && data.name != null){
        //update the llist of people online
        var users = '';
        for (var i = 0; i < data.ids.length; i++) {
            if(data.names[i] != null)
                users +='<a class="list-group-item" href="/#'+ data.ids[i] + '">'+ data.names[i] +'</a>';
        }
        $('#online').html(users);
        $('#totalOnline').text(data.clients);
        //Send an alert to the message box
        $('#message-box').append('<div><p class="notifications text-center text-info">' + data.name + ' left ...</p></div>')
    }
});

function whoIsOnline(data) {
    //update the llist of people online
    var users = '';
    for (var i = 0; i < data.ids.length; i++) {
        users +='<a class="list-group-item" href="/#'+ data.ids[i] + '">'+ data.names[i] +'</a>';
    }
    $('#online').html(users);
    $('#totalOnline').text(data.ids.length);
}

function cleanInput( arbitraryHtmlString ) {
    const temp = document.createElement('div');
    temp.innerHTML = arbitraryHtmlString;
    return temp.innerText;
}

function updateScroll(position) {
    console.log(position)
}
