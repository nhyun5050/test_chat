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

server.listen(8080, function(){
    console.log('Server run....');
});