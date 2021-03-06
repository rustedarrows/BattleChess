ig.module(
    'plugins.server'
)
    .requires(
        'impact.game',
        'impact.entity',
        'impact.loader',
        'impact.input',
        'impact.system'
)
    .defines(function() {
        Server = ig.Class.extend({
            clients: {},
            init: function() {
                this.io = require('socket.io-client');
                this.socket = this.io.connect('localhost', {
                    port: 3000
                });
                var self = this;
                this.socket.on('connect', function(socket) {

                }).on('client.disconnected', function(socket) {
                    self.clientDisconnected(socket);
                }).on('client.reconnected', function(socket) {
                    self.clientReconnected(socket);
                }).on('screen.moved', function(obj) {
                    self.screen.x = obj.x;
                    self.screen.y = obj.y;
                }).on('input.events', function(socket, obj) {
                    self.clients[socket].sock.input['set_' + obj.type](obj.action);
                }).on('input.mousemoved', function(socket, obj) {
                    self.clients[socket].sock.input.mouse.x = obj.x;
                    self.clients[socket].sock.input.mouse.y = obj.y;
                }).on('client.connected', function(socket) {
                    self.clientConnected(socket);
                });
                // Every second calculate the average ping for clients.
                /*this.clientInterval = setInterval(function() {
                    var total = i = 0;
                    for (var key in this.clients) {
                        if (!this.clients[key]) continue;
                        total += this.clients[key].latency.avg;
                        i++;
                    }
                    this.clientAvgPing = parseInt(total / i);
                }, 1000);*/
            },
            emit: function(to, key, data) {
                if (!to || !to.emit) return;
                return to.emit(key, data);
            },
            broadcast: function(key, data) {
                for (var i in this.clients)
                    this.emit(this.clients[i], key, data);
            },
            clientConnected: function(s) {
                console.log('[INFO] Client connected: ' + s.id);
                this.clients[s.id] = s;
                // Each client needs its own input class.
                this.clients[s.id].sock = s;
                this.clients[s.id].sock.input = new ig.Input();
                this.clients[s.id].sock.screen = {
                    x: 0,
                    y: 0
                };
                //ig.latency(socket);
                // Send the client all the active entities
                var self = this;
                ig.game.entities.forEach(function(ent) {
                    self.entityCreate(ent.classType, ent.pos.x, ent.pos.y, ent._settings, s.id);
                    self.entityMove(ent, s.id);
                });
                this.socket.emit('client.connect', {
                    id: s.id
                });
            },
            clientReconnected: function(socket) {
                console.log('[INFO] Client reconnected: ' + socket.id);
                this.socket.emit('client.reconnect', {
                    id: socket.id
                });
            },
            clientDisconnected: function(socket) {
                console.log('[INFO] Client disconnected: ' + socket.id);
                this.socket.emit('client.disconnect', {
                    id: socket.id
                });
                this.clients[socket.id] = undefined;
                // Remove all entities for the client that disconnected.
                // Count down so removing entities doesnt mess anything up.
                var cnt = ig.game.entities.length - 1;
                var removed = 0;
                for (var i = cnt; i >= 0; i--) {
                    var ent = ig.game.entities[i];
                    // Use removeEntity instead of kill.
                    if (ent.owner == socket.id) {
                        ig.game.removeEntity(ig.game.entities[i]);
                        removed++;
                    }
                }
                console.log('[INFO] Removing ' + removed + ' entities');
            },
            entityCreate: function(typeStr, x, y, settings, toSocket) {
                var data = {
                    type: typeStr,
                    x: x,
                    y: y,
                    settings: settings
                };
                var key = 'entity.create';
                this.socket.emit(key, data, toSocket);
            },
            entityMove: function(entity, toSocket) {
                var pos = entity.getPos();
                var data = {
                    name: entity.name,
                    x: pos.x,
                    y: pos.y,
                    a: pos.a,
                    anim: entity.anim
                };
                var key = 'entity.move';
                this.socket.emit(key, data, toSocket);
            },
            entityRemove: function(entity, toSocket) {
                var data = {
                    name: entity.name
                };
                var key = 'entity.remove';
                this.socket.emit(key, data, toSocket);
            },
            classToString: function(classObj) {
                // Node has a relatively thin global object so
                // this is nowhere as stressful as the browser-side.
                var key = '';
                for (var i in global)
                    if (global[i] == classObj)
                        key = i;
                return key;
            }
        });

        GameServer = ig.Game.extend({
            spawnEntity: function(type, x, y, settings) {
                // Find the key for the entity type
                var key = ig.server.classToString(type);
                settings = settings || {};
                // Give the entity a unique name. This is the entity id.
                // The server will tell the clients how to move entities based on this id.
                settings.name = ig.Entity._lastId + 1;
                settings.classType = key;
                // If socket is provided then set the owner id
                if (settings.socket)
                    settings.owner = settings.socket.id;
                var ent = this.parent(global[key], x, y, settings);
                // Remove the socket reference before sending it to the clients.
                var socket = null;
                if (settings.socket) {
                    socket = settings.socket;
                    settings.owner = socket.id;
                    delete settings.socket;
                }
                ig.server.entityCreate(key, ent.pos.x, ent.pos.y, settings);
                return ent;
            },
            removeEntity: function(entity) {
                if (entity instanceof EntityServer)
                    ig.server.entityRemove(entity);
                this.parent(entity);
            }
        });

        EntityServer = ig.Entity.extend({
            // simple callback when this entity is killed.
            killed: function(ent) {},
            // Stub the currentAnim property
            currentAnim: {
                angle: 0,
                update: function() {},
                draw: function() {}
            },
            init: function(x, y, settings) {
                var socket = settings.socket || undefined;
                settings.socket = undefined;
                // Cache the settings so when a client joins
                // we can pass the same settings.
                this._settings = settings;
                if (socket) {
                    this.socket = socket;
                    this.input = socket.input;
                    this.screen = socket.screen;
                    this.anim = '';
                    this.team = settings.team;
                }
                this.parent(x, y, settings);
            },
            spawn: function(type, x, y, settings) {
                var ent = ig.game.spawnEntity(type, x, y, settings);

                if (this.owner) {
                    ent.owner = this.owner;
                }
                return ent;
            },
            update: function() {
                this.last = this.getPos();
                this.parent();
            },
            draw: function() {
                this.parent();
                var cur = this.getPos();
                if (this.last.x != cur.x ||
                    this.last.y != cur.y ||
                    this.last.a != cur.a ||
                    this.last.anim != cur.anim)
                    ig.server.entityMove(this);
            },
            getPos: function() {
                return {
                    x: this.pos.x,
                    y: this.pos.y,
                    a: this.currentAnim ? this.currentAnim.angle : 0,
                    anim: this.anim
                };
            },
            kill: function() {
                this.parent();
                this.killed(this);
            }
        });

        // No need to loads images, etc.
        ig.Loader.inject({
            load: function() {
                ig.system.setGame(this.gameClass);
            }
        });

        // Allow input to be triggered by clients.
        ig.Input.inject({
            set_keydown: function(action) {
                this.actions[action] = true;
                if (!this.locks[action]) {
                    this.presses[action] = true;
                    this.locks[action] = true;
                }
            },
            set_keyup: function(action) {
                this.delayedKeyup[action] = true;
            }
        });

        // System needs to reset client inputs.
        ig.System.inject({
            gameCnt: 0,
            setGame: function(gameClass) {
                this.parent(gameClass);
                this.gameCnt++;
                if (this.gameCnt <= 1) return;
                var key = ig.server.classToString(gameClass);
                ig.server.broadcast('system.set-game', {
                    class: key
                });
            },
            setServer: function(serverClass) {
                ig.server = new(serverClass)();
            },
            run: function() {
                this.parent();
                // Clear all the inputs for the sockets.
                for (var i in ig.server.clients) {
                    if (ig.server.clients[i] && ig.server.clients[i].input)
                        ig.server.clients[i].input.clearPressed();
                }
            }
        });

        // Rewrite this function to delay and allow the server class to setup.
        ig.main = function(canvasId, gameClass, fps, width, height, scale, loaderClass) {
            ig.system = new ig.System(canvasId, fps, width, height, scale || 1);
            ig.input = new ig.Input();
            ig.soundManager = new ig.SoundManager();
            ig.music = new ig.Music();
            ig.ready = true;

            var loader = new(loaderClass || ig.Loader)(gameClass, ig.resources);
            setTimeout(function() {
                loader.load();
            }, 100);
        };
    });
