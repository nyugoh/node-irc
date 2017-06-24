const express = require('express'),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http);

var clients = 0;
var register = [0],
	usernames = ['Jarvis  ~ Bot'];

app.use('/public', express.static('./public'));

app.get('/', (request, response)=>{
	response.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, ()=>{
	console.log('App is running on port 3000 ...')
});

io.on('connection', (socket)=>{
	console.log("A client connected ... " + socket.id);
	socket.emit('bootstraper', usernames);

	socket.on('reconnect', ()=>{
		console.log("Client reconnected ...");
	});

	socket.on('disconnect', ()=>{
		console.log("Client disconnected ..." + socket.id);
		clients > 0 ? clients -- : clients = 0;

		// Remove the name and socket id
		name = usernames[register.indexOf(socket.id)]; // Name of the person that left
		delete usernames[register.indexOf(socket.id)];
		delete register[register.indexOf(socket.id)];
		io.sockets.emit('leave update', {names : usernames, ids : register, name : name, clients: clients});
	});

	socket.on('join', (data)=>{
		register.push(data.id);
		usernames.push(data.name);
		clients ++; //Increment total connected clients
		name = usernames[register.indexOf(socket.id)]; // Name of the person that left
		//Send to all other sockets the name of the new member
		io.sockets.emit('new member', {names : usernames, ids : register, name : name, clients: clients});//Emit an update
	});

	socket.on('chat', (data)=>{
		io.sockets.emit('chat', {ids : register, names : usernames, senderId : data.id, chat : data.chat})
	})

})
