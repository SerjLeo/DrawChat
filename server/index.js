const WebSocket = require('ws');
const http = require('http')
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');

const app = express();
const clients = new Map();

//Defining routes
let router = express.Router()

router.post('/login', (req, res) => {
  const id = uuid.v4();
  console.log('Login route fetched');
  req.session.userId = id;
  req.session.userName = req.body.name;
  res.status(201).send({ result: 'OK', message: 'Session updated' })
});

router.delete('/logout', (request, response) => {
  const ws = clients.get(request.session.userId);
  console.log('Destroying session');
  request.session.destroy(function() {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

//Using middleware
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});
app.use(bodyParser.json());
app.use(sessionParser);
app.use(express.static(__dirname + '/public'))
app.use('/', router)

const server = http.createServer(app)
const wss = new WebSocket.Server({clientTracking: false, noServer: true});

server.on('upgrade', function(request, socket, head){
  console.log('Upgrade event handler');
  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      console.log('Parsing failed');
      socket.destroy();
      return null;
    }
    console.log('Session is parsed!');
    wss.handleUpgrade(request, socket, head, function(ws) {
      wss.emit('connection', ws, request);
    });
  });
})


server.listen(8080, function() {
  console.log('Listening on http://localhost:8080');
});

wss.on('connection', function(ws, request) {
  const userId = request.session.userId;
  const userName = request.session.userName;

  clients.set(userId, ws);
  
  for (let client of clients.values()) {
    client.send(JSON.stringify({
      message: `${userName} connected to chat!`
    }))
  }

  ws.on('message', function(message) {
    let msg = JSON.parse(message)
    let sendData = {
      message: msg,
      from: userName
    }
    for (let client of clients.values()) {
      client.send(JSON.stringify(sendData))
    }
  });

  ws.on('close', function() {
    clients.delete(userId);
    for (let client of clients.values()) {
      client.send(JSON.stringify({
        message: `${userName} left chat!`
      }))
    }
  });
});