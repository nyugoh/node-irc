const express = require('express'),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http);

var clients = 0;
var register = [],
	usernames = [];

app.use('/public', express.static('./public'));

app.get('/', (request, response)=>{
	response.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, ()=>{
	console.log('App is running on port 3000 ...')
});

io.on('connection', (socket)=>{
	console.log("A client connected ... " + socket.id);

	socket.on('reconnect', ()=>{
		console.log("Client reconnected ...");
	});

	socket.on('disconnect', ()=>{
		console.log("Client disconnected ...");
		clients > 0 ? clients -- : clients = 0;
		io.sockets.emit('leave update', {names : usernames, ids : register, id : socket.id, clients : clients});
	});

	socket.on('join', (data)=>{

		if(data.id == socket.id){
			register.push(data.id);
			usernames.push(data.name);
			clients ++; //Increment total connected clients
		}


		//Send to all other sockets the name of the new member
		io.sockets.emit('new member', {names: usernames, ids : register});//Emit an update

		//
	});

	socket.on('chat', (data)=>{
		io.sockets.emit('chat', {ids : register, names : usernames, senderId : data.id, chat : data.chat})
	})
})
