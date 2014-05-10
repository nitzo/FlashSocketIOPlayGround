var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , redis = require('redis')
    , RedisStore = require('socket.io/lib/stores/redis')
    , argv = require('optimist').argv;

var port = argv.port;
port = port || 3005;
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index.ejs', { port: port});
    //res.sendfile(__dirname + '/index.html');
});


app.get('/sockets', function (req, res) {
    var data = {};
    data.connectedClients = io.sockets.clients();

    res.render('sockets.ejs', data);
});


var pub = redis.createClient(), sub = redis.createClient(), client = redis.createClient();

pub.auth('screemo', function (err) {
    if (err) throw err;
});
sub.auth('screemo', function (err) {
    if (err) throw err;
});
client.auth('screemo', function (err) {
    if (err) throw err;
});


io.set('store', new RedisStore({
    redis: redis, redisPub: pub, redisSub: sub, redisClient: client
}));

io.sockets.on('connection', function (socket) {
    socket.set('port', port);
    socket.join(socket.id);

    socket.on('broadcast', function (data) {
        console.log('BROADCAST Recieved! ' + JSON.stringify(data));
        socket.broadcast.emit('message', data.message);
        socket.emit('message', 'Message ' + data.message + ' was broadcasted!');
    });


    socket.on('message', function (data) {
        console.log('Message Recieved! ' + JSON.stringify(data));

        if (data.socketid){
            socket.broadcast.to(data.socketid).emit('message', data.message + ' from ' + socket.id);
            socket.emit('message', 'Message ' + data.message + ' was sent to ' + data.socketid);
        }
        else {
            socket.emit('message', 'No socket specified!! ');
        }



    });


});

server.listen(port);
console.log('Listening on port: ' + port);