// client side engine
class chatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBoxId=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.socket=io.connect('http://35.89.35.17:5000',{transport:['websocket']}); // available from cdn file
        // io.connect fires event connection on socket server --> see chat sockets

        if(this.userEmail){
            this.connectionHandler();
        }
    }


    createMessagePill(data){
        let senderMail=data.user_email;
        let msg=data.msg;
        console.log('create');
        let messageType='other-message';
        if(senderMail==this.userEmail){
            messageType='self-message'
        }
        return(`
        <li class="${messageType}">
            <span>${msg}</span>
            <div class="user-mail">${senderMail}</div>
        </li>
        `)
    }

    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection Established using sockets');

            // 1)user emits to join room 
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codeial'
            })
            // 4) once connected to chatroom it recieves emit form chat socket
            self.socket.on('user_joined',function(data){
                console.log('a user joined', data);
            })



            // emiiting message from chat box
            // this will be recieved by chat socket in chatroom
            $('#send-message').click(function(){
                let message=$('#chat-message-input').val();
                if(message!=''){
                    self.socket.emit('send_message',{
                        user_email:self.userEmail,
                        chatroom:'codeial',
                        msg:message
                    })
                    $('#chat-message-input').val("");
                }
            });


            // check for recievd_message
            self.socket.on('recieve_message',function(data){
                console.log('message recieved',data.msg);
                let messagePill=self.createMessagePill(data);
                $('.chat-message-list').append(messagePill);
            })

        });
    }
}