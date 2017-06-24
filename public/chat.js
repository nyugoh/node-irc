var socket = io('http://localhost:3000');

$join = $('#join');
$feedback = $('#feedback');
var username = $('#name').val();

socket.on('join update', (data)=>{
	$('#update').append('<p>Connected :<span class="budge">' + data.clients + '</span><span class="glyphicon glyphicon-user">'+ data.names[data.ids.indexOf(socket.id)] + '</span></p>');
	$('#messages').append('<p class="text-center text-info">There are ' + data.clients + ' people online.</p>');
});

socket.on('connect', ()=>{
	console.log(socket.id)
});

socket.on('disconnect', ()=>{
	console.log('disconnetct');
	$('#messages').append('<p class="text-center text-info">There are ' + data.usernames[data.ids.indexOf(socket.id)] + ' people online.</p>');
});


socket.on('leave update', (data)=>{
	$('#update').append('<p>Connected :<span class="budge">' + data.clients + '</span><span class="glyphicon glyphicon-user">'+ data.names[data.ids.indexOf(socket.id)] + '</span></p>');
	$('#messages').append('<p>' + data.names[data.ids.indexOf(data.id)] + ' left.</p>');
});

socket.on('new member', (username)=>{
	$('#messages').append('<p class="text-center text-info">' + username + ' has joined the irc</p>');
});

$(function(){
	var name = $('#name').val();

	$('#nickname').on('submit', (e)=>{
		e.preventDefault();

		//Check for name
		if($('#name').val().trim() == ''){
			$feedback.html('<p class="text-warning">A name is required...</p>')
		}else if($('#name').val().trim().length < 3){
			$feedback.html('<p class="text-warning">Name must be atleast 3 characters ...</p>');
		}else{
			socket.emit('join',$('#name').val().trim());
			$('#login').text('');//Empty the fields
			$feedback.text(''); //Remove any feedback if any
			$('#login').html(content);
			//window.load('chat.html')

		}
	})
});

// var content = '<div id="messages"></div><form id="chatForm"><input type="text" autofocus="on" id="message" placeholder="Type a message ..." class="form-control"></form>';


// Send a message
$('#chatForm').submit((e)=>{
	e.preventDefault();

	if($('#message').trim().length == 0){
		$('#messages').append('<div class="alert alert-danger">A message is required</div>');
	}else{
		//broadcast message
		socket.emit('chat', {id : socket.id, message : $('#message').trim()});
	}
});

socket.on('chat', (data)=>{
	$('#messages').append('<p><strong>'+ data.usernames[data.register.indexOf(data.id)] +'</strong>'+data.message + '</p>');
})
