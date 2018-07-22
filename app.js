'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, 'public')));
// Expose the license.html at http[s]://[host]:[port]/licences/licenses.html
app.use('/licenses', express.static(path.join(__dirname, 'licenses')));

app.use('/api/greeting', (request, response) => {
  const name = request.query ? request.query.name : undefined;
  response.send({content: `Hello, ${name || 'World!'}`});
});
module.exports = app;

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log('new incoming connection:');

	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;

	SOCKET_LIST[socket.id] = socket;

	console.log('new client:'+socket.id);

	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
	});
});

setInterval(function(){
	console.log('Updating positions')
	var pack = [];
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.x++;
		socket.y++;

		pack.push({
                        x:socket.x,
                        y:socket.y
                });
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		console.log('emiting to:'+socket.id);
		console.log('pack size:'+pack.length);
		socket.emit('newPosition',pack);
	}
},1000/25);
