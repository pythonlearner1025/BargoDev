// backend nodeJS server
//const { on } = require('events');
const express = require('express');
const app = express(),
        port = 300,
        port2 = 3060;
const http = require('http');
// HTTP server created
const server = http.createServer(app);

// New instance of socket connected to HTTP server
const {Server} = require('socket.io');
const io = new Server(server);

// Dec 11 bug: attempted to add session management system,
// resulted in crash. Conflict with socket that I do not 
// understand (socket does not work)
// read medium article in learn doc to learn and solve

/*
// session management
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// set up express session middleware on serverside (this)
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// parse html
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

const account = 'test';
var session;
var session_account;

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/pages/posts/first-post',(req,res) => {
    if(req.body.account == account){
        session=req.session;
        session_account=req.body.account;
        console.log(req.session)
        //res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        //res.send('Invalid username or password');
    }
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
*/

// listen to incoming 'connection' events
let clicks = 0;
let userNum = 0;

// 

io.on('connection', (socket)=>{
    userNum++;
    console.log(userNum, ' user connected');
    // format for emitting msg to everyone connected:
    //io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

   socket.on('clicked', msg=>{
    clicks++;
    var message = 'clicked '+ msg;
    console.log(message);
    console.log(clicks + ' total clicks')
   })

   socket.on('disconnect', () => {
       userNum--;
       console.log('user disconnected');
       console.log(userNum, ' users left')
   })
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});
