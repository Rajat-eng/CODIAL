{
   
    let successFlash = function(message){
        new Noty({
            theme : 'mint' , 
            text: message,
            type: 'alert',
            layout : "topRight",
            timeout : 1500
            
            }).show();
    }

    let errorFlash = function(message){
        new Noty({
            theme : 'mint' , 
            text: message,
            type: 'error',
            layout : "topRight",
            timeout : 1500
            
        }).show();
    }

    $('#friend-toggle').click(function(e){
        e.preventDefault();
        let self=this;
        $.ajax({
            method:"GET",
            url:$(self).attr('href'),
        })
        .done(function(data){
            let theMessage;
            console.log(data);
            if(data.data.friendshipStatus){
                theMessage = "Friend Added !";
                $('#friend-toggle-button').html('Remove Friend');
            }else{
                theMessage = "Friend Removed !";
                $('#friend-toggle-button').html('Add Friend');
            }
            successFlash(theMessage);
        })
        .fail(function(err){
            console.log("error in toggling friend !" , err);
            errorFlash("Cant Update Friend !");
        })
    })
}