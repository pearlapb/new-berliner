const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const dbFriends = require('./config/dbFriendReq.js');
const dbProfiles = require('./config/dbGeneral.js');

const chalk = require('chalk');

app.use(cookieSession({
    name: 'session',
    secret: 'This1 Is2 a3 vERRy4 diFFicUlt5 SecrEt6 to7 KEEP8',
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

app.use('/public', express.static(__dirname+ '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/', require('./routes/updateProfileRoutes.js'));
app.use('/', require('./routes/regAndLoginRoutes.js'));
app.use('/', require('./routes/getUserProfilesRoutes.js'));
app.use('/', require('./routes/friendRequestsRoutes.js'));
app.use('/', require('./routes/profilePostsRoutes.js'));
app.use('/', require('./routes/searchBarRoute.js'));
app.use('/', require('./routes/chatRoomRoutes.js'));

app.get('/', function(req, res) {
    if (!req.session.user) {
        res.redirect('/Welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/Welcome', function(req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

let onlineUsers = [];

app.get('/connected/:socketId', (req, res) => {
    if (req.session.user) {
        io.sockets.sockets[req.params.socketId] &&
            onlineUsers.push({
                socketId: req.params.socketId,
                userId: req.session.user.userId
            });
        console.log(chalk.bgGreen('onlineUsers after new connection'), onlineUsers);
        io.sockets.emit('updateOnlineUsers', onlineUsers);
    }
});

app.get('/getAllOnlineUsers', (req, res) => {
    var onlineIds = onlineUsers.map(item => item.userId);
    var filteredIds = onlineIds.filter((id, index) => {
        return onlineIds.indexOf(id) == index;
    });
    dbProfiles.getManyProfileSummaries(filteredIds).then((onlineResults) => {
        res.json({ results: onlineResults });
    }).catch((err) => {
        console.log(err);
        res.json({ error: true });
    });
});

app.get('/getAllOnlineFriends', (req, res) => {
    let onlineUsers;
    dbFriends.getAllFriends(req.session.user).then((result) => {
        let friendIds = result.rows.map(function(friendResult) {
            if (friendResult.sender_id == req.session.user.userId) {
                return friendResult.recipient_id;
            } else {
                return friendResult.sender_id;
            }
        });
        let onlineFriends = [];
        friendIds.map(function(friendId) {
            for (var j = 0; j < onlineUsers.length; j++) {
                if (friendId == onlineUsers[j].userId) {
                    onlineFriends.push(friendId);
                }
            }
        });
        dbProfiles.getManyProfileSummaries(onlineFriends).then((summaryResults) => {
            res.json({ results: summaryResults });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    }).catch((err) => {
        console.log(err);
        res.json({ error: true });
    });
});

let lastMessages = [];

app.get('/getLastMessages', (req, res) => {
    res.json({ messages: lastMessages });
});

/*app.get('/getLastMessages/:userId', (req, res) => {
    console.log(req.params);
    if (req.session.user) {
        io.sockets.sockets[req.params.socketId] &&
            onlineUsers.push({
                socketId: req.params.socketId,
                userId: req.session.user.userId
            });
        console.log(chalk.bgGreen('onlineUsers after new connection'), onlineUsers);
        io.sockets.emit('updateOnlineUsers', onlineUsers);
    }
});*/

app.set('onlineUsers', onlineUsers);

app.get('*', function(req, res) {
    if (!req.session.user) {
        res.redirect('/Welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log(chalk.bgMagenta("I'm listening."));
});

io.on('connection', function(socket) {
    console.log(chalk.bgBlue(`socket with the id ${socket.id} is now connected`));
    socket.on('disconnect', function() {
        for (var i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].socketId == socket.id) {
                onlineUsers.splice(i, 1); //cehck to see if there is none left in the list with that user id
            }
        }
        console.log(chalk.bgBlue(`socket with the id ${socket.id} is now disconnected`));
        console.log(chalk.bgGreen('onlineUsers after disconnection'), onlineUsers);
        io.sockets.emit('updateOnlineUsers');
    });

    socket.on('sendMessage', function(data) {
        lastMessages.push(data);
        io.sockets.emit('newMessage', { message: data });
    });

    /*socket.on('sendPersonalMessage', function(data) {

    })*/

});
