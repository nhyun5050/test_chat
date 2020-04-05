/* Node.js 기본 내장 모듈 */
const fs = require("fs")

const express = require('express');

const socket = require('socket.io');

const http = require('http');

const app = express();

const server = http.createServer(app);

const io = socket(server);

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get("/", function(request, response){
    //console.log("유저가 / 로 접속하였습니다.");
    //response.send('hello express server');
    fs.readFile('./static/index.html', function(err, data){
        if(err){
            response.send("에러");
        }
        else{
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
}); 

io.sockets.on('connection', function(socket){
    console.log('user connected');

    // 새로운 유저가 접속했을경우 다른 소켓에 알려줌
    socket.on('newUser', function(name){
        console.log(name+"님이 접속하였습니다.");
        socket.name = name;
        io.sockets.emit('update', { 
                                    type:'connect', 
                                    name:'SERVER', 
                                    message:name+'님이 접속하였습니다.'
        });
    })

    // 전송한 메시지 받기
    socket.on('message', function(data){
        // 받은 데이터에 누가 보냈는지 이름 추가
        data.name = socket.name;
        console.log(data);

        // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit('update', data);
    })

    socket.on('send', function(data){
        console.log('sendded msg : '+data.msg);
    })

    socket.on('disconnect', function(){
        console.log('user disconnected- name:'+socket.name)

        //나가는 사람을 제오한 나머지 유저에게 퇴장 메시지 전송
        socket.broadcast.emit('update', {
            type:'disconnect'
            ,name:'SERVER'
            ,message:socket.name+ ' 님이 나가셨습니다.'
        });
    })
})

server.listen(8080, function(){
    console.log('Server run....');
});