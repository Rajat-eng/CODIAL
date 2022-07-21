{
    let chatbox_toggle = $('#chat-size-button');
    let chatboxWrapper = $('.chat-box-wrapper');

chatbox_toggle.click(function(){
    if(chatboxWrapper[0].classList.contains('chat-box-wrapper')){
        chatboxWrapper[0].classList.remove('chat-box-wrapper');
    }
    else{
        chatboxWrapper[0].classList.add('chat-box-wrapper');
    }
     
    chatboxWrapper[0].classList.toggle('minimised-ht');
});

}

