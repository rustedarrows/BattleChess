var path = require('path');
var fs = require('fs');

try {
    var config = require(__dirname + '/config.js');
} catch (err) {
    throw "Missing config.js. Run 'cp server/config.js.example server/config.js'.";
}

// Setup paths
var root = path.dirname(__dirname);
var impactPath = root + '/' + config.impact;
var impactLibPath = impactPath + '/lib';
var publicPath = root + '/' + config.assets;

if (!fs.existsSync(publicPath + '/index.ejs'))
    throw "Missing index.ejs. Run 'cp public/index.ejs.example public/index.ejs'.";

// Alter the env to allow impact
// to run without DOM interaction.
var Canvas = function() {
    return {
        addEventListener: function() {},
        style: {},
        getContext: function() {
            // This is the context
            return {
                save: function() {},
                translate: function() {},
                rotate: function() {},
                restore: function() {},
                drawImage: function() {},
                strokeRect: function() {},
                beginPath: function() {},
                moveTo: function() {},
                lineTo: function() {},
                stroke: function() {},
                clearPath: function() {},
                scale: function() {},
                fillRect: function() {}
            };
        }
    };
};
global.window = global;
global.ImpactMixin = {
    module: function() {
        return ig;
    },
    requires: function() {
        var requires = Array.prototype.slice.call(arguments);
        // Go ahead and require the proper files
        requires.forEach(function(name) {
            // Ignore any dom ready type stuff on the server.
            if (name == 'dom.ready') return;
            var path = name.replace(/\./g, '/');
            require(impactLibPath + '/' + path);
        });
        return ig;
    },
    defines: function(func) {
        func(); // immediately execute
    },
    $: function(selector) {
        return new Canvas();
    }
};
window.document = {};
window.addEventListener = function() {};

// Canvas should be the only element impact uses on the server.
window.HTMLElement = Canvas;
require(impactLibPath + '/impact/impact.js');

// Setup the webserver
var express = require('express');
var http = require('http');
var app = express();
app.enable("jsonp callback");
var server = app.listen(config.port);
// Setup the websockets
ig.io = require('socket.io').listen(server);
ig.io.set('log level', 1);
var clients = [];
var rooms = [];
ig.io.sockets.on('connection', function(socket) {
    socket.on('disconnect', function() {
        socket.broadcast.to(socket.room).emit('client.disconnected', {
            id: socket.id
        });
    }).on('reconnect', function() {
        socket.broadcast.to(socket.room).emit('client.reconnected', {
            id: socket.id
        });
    }).on('screen.move', function(obj) {
        socket.broadcast.to(socket.room).emit('screen.move', obj);
    }).on('input.event', function(obj) {
        socket.broadcast.to(socket.room).emit('input.event', obj);
    }).on('input.mousemove', function(obj) {
        socket.broadcast.to(socket.room).emit('input.mousemove', obj);
    }).on('client.connect', function(data) {
        socket.broadcast.to(socket.room).emit('client.connect', data);
    }).on('client.reconnect', function(data) {
        socket.broadcast.to(socket.room).emit('client.reconnect', data);
    }).on('client.disconnect', function(data) {
        socket.broadcast.to(socket.room).emit('client.disconnect', data);
    }).on('entity.create', function(data, s) {
        if (s) {
            if (clients[s])
                clients[s].emit('entity.create', data);
        } else {
            socket.broadcast.to(socket.room).emit('entity.create', data);
        }
    }).on('entity.move', function(data, s) {
        if (s) {
            if (clients[s.id])
                clients[s.id].emit('entity.move', data);
        } else {
            socket.broadcast.to(socket.room).emit('entity.move', data);
        }
    }).on('entity.remove', function(data, s) {
        if (s) {
            if (clients[s.id])
                clients[s.id].emit('entity.remove', data);
        } else {
            socket.broadcast.to(socket.room).emit('entity.remove', data);
        }
    }).on('set.room', function(room) {
        socket.leave(socket.room);
        socket.room = room;
        socket.broadcast.to(socket.room).emit('client.connected', {
            id: socket.id
        });
    }).on('input.event', function(data) {
        socket.broadcast.to(socket.room).emit('input.events', socket.id, data);
    }).on('input.mousemove', function(data) {
        socket.broadcast.to(socket.room).emit('input.mousemoved', socket.id, data);
    }).on('screen.move', function(data) {
        socket.broadcast.to(socket.room).emit('screen.moved', data);
    });
    socket.join('lobby');
    clients[socket.id] = socket;
    socket.broadcast.to(socket.room).emit('client.connected', {
        id: socket.id
    });
});

// Setup the latency checking
ig.latency = require(__dirname + '/latency');

// Setup routes and asset paths
app.use(express.static(publicPath));
app.use('/impact', express.static(impactPath));
app.get('/', function(req, res) {
    res.render(publicPath + '/index.ejs', {
        config: config
    });
});
module.exports = {
    config: config,
    ig: ig,
    web: app,
    io: ig.io,
    // Start a game
    start: function() {
        require(impactLibPath + '/game/server/main.js');
    },
    beforePageLoad: function(req, res) {}
};
