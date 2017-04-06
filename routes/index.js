module.exports = function(io){
    var app = require('express');
    var path = require('path');
    var router = app.Router();
    var index_io = io.of(path.join('', 'index'));
    var room = {};
    index_io.on('connection', function(socket){
        socket.on('disconnect', function () {
        });
        socket.on('roomChange', function(data){
            room = data;
        });
        index_io.emit('roomChange',room);
    });


    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });
    return router;
};
