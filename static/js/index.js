var socket = io();

socket.on('connect', function(){
    var input = document.getElementById('test');
    input.value = '접속 됨';

    var name = prompt('반갑습니다!', '');
    
    name = !name? '익명' : name;
    
    socket.emit('newUser', name);
})

socket.on('update', function(data){
    console.log(`${data.name}:${data.message}`);

})

function send()
{
    var message = document.getElementById('test').value;

    document.getElementById('test').value = '';

    //서버로 message 이벤트 전달
    socket.emit('message', {
        type:'message',
        message:message
    });
}