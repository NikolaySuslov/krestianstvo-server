var express = require('express'),
    http = require('http'),
    https = require('https'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    serveIndex = require('serve-index'),
    path = require('path')

var app = express();
var port = 8080;

app.use(compression());
app.use(serveStatic(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


/*=====Site specific paths=====*/

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/', 'index.html'))
})

//=========end of specific===========

function registerReflector(srv) {

      console.log('register reflector server...\n');
      var reflectorServer = require('lcs-reflector'),
          sio = require('socket.io')(srv, {
            transports: ['websocket']
        })

      sio.sockets.on('connection', reflectorServer.OnConnection);
      global.instances = {};
}

var srv = http.createServer(app).listen(port);
    registerReflector(srv);

console.log('Web server is started on port: '+ port);
