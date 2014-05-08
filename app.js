

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
    , redis = require('redis')
    , RedisStore = require('socket.io/lib/stores/redis')
    ,argv = require('optimist').argv;

var port = argv.port;
port = port || 3005;
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index.ejs', { port : port});
  //res.sendfile(__dirname + '/index.html');
});


app.get('/sockets', function(req, res){
    var data = {};
    data.connectedClients = io.sockets.clients();

    res.render('sockets.ejs', data);
});


var pub = redis.createClient(), sub = redis.createClient(), client = redis.createClient();

pub.auth('screemo', function (err) { if (err) throw err; });
sub.auth('screemo', function (err) { if (err) throw err; });
client.auth('screemo', function (err) { if (err) throw err; });



io.set('store', new RedisStore({
    redis : redis
   ,redisPub : pub
   ,redisSub : sub
   ,redisClient : client
}));

io.sockets.on('connection', function (socket) {
  socket.set('port', port);
  socket.on('data', function (data) {
    console.log('DATA Recieved! '  + data);
      socket.broadcast.emit('data', data);
  });
});

server.listen(port);
console.log('Listening on port: ' + port);