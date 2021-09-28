const express = require('express');
const morgan = require('morgan');
const SocketIO = require('socket.io');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = SocketIO(server);

require('./sockets')(io);
require('./database');

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//settings
app.set('port', process.env.PORT || 4000);

//static files
app.use(express.static(path.join(__dirname,'public')));

//starting the server
server.listen(app.get('port'),() => {
    console.log(`Server on port ${app.get('port')}`);
});




