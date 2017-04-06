module.exports = function(io){
    var app = require('express');
    var path = require('path');
    var router = app.Router();
    var channelio = io.of(path.join('', 'room'));
    var room = {};

    router.get('/*', function(req, res, next) {
        res.clearCookie('username');
        res.render('room', { title: 'Express', channel: decodeURIComponent(req.originalUrl.substring(1))});
    });
    router.post('/*', function(req, res, next) {
        var channel = req.body.channel;
        if (channel.length > 0) {
            res.redirect(channel);
            res.end();
        }else {
            res.redirect('/');
            res.end();
        }
    });

    channelio.on('connection', function(socket){

        var url = socket.request.headers.referer;
        var splited = url.split('/');
        var roomID = splited[splited.length - 1];

        socket.join(roomID);
        channelio.emit('userChange', room);
        socket.on('disconnect', function () {
            if(typeof room[roomID] === 'undefined') {
                //null
            }else {
                if(typeof room[roomID][socket.conn.id] === 'undefined') {
                    //null
                }else {
                    channelio.to(roomID).emit('sys', room[roomID][socket.conn.id]+'離開了房间');
                    delete room[roomID][socket.conn.id];
                }
            }
            io.of(path.join('', 'index')).emit('roomChange',room);
            channelio.emit('userChange', room);
            console.log(room);
        });
        socket.on('messages', function(msg){
            var username = room[roomID][socket.conn.id];
            channelio.to(roomID).emit('messages', {user: username,message: msg});
        });

        socket.on('newuser', function(username){
            channelio.to(roomID).emit('sys', username + '加入了房间');
            if(typeof room[roomID] === 'undefined') {
                room[roomID] = {};
                room[roomID][socket.conn.id] = {};
                room[roomID][socket.conn.id] = username;
            }else {
                room[roomID][socket.conn.id] = {};
                room[roomID][socket.conn.id] = username;
            }
            io.of(path.join('', 'index')).emit('roomChange',room);
            channelio.emit('userChange', room);
            console.log(room);
        });

    });

    return router;
};
