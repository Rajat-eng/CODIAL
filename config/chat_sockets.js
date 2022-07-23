// dalal server 

module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"],
            transports:["websockets","polling"],
            credentials: true
        },
        allowEIO3:true
    });
    
    io.on('connection',(socket)=>{
        console.log('new connection recieved',socket.id);
        // this sends an ackonwledgement to connecthandler in chat engine

        socket.on('disconnect',()=>{
            console.log('user disconnected');
        })



        // 2) chat socket recies emit req form chat engine
        socket.on('join_room',function(data){
            console.log('joining req recieved',data);
            socket.join(data.chatroom);
            // 3)emitting notifiaction from chat sockets to users in this chatroom
            io.in(data.chatroom).emit('user_joined',data.user_email);
        });



        // socket recieved message
        socket.on('send_message',function(data){
            console.log('msg recievd by socket',data.msg);
            io.in(data.chatroom).emit('recieve_message',data);
        });



    });
}