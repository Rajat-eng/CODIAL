class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement; // link like button
        this.toggleLike();
    }
    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self=this;

            $.ajax({
                method:'GET',
                url:$(self).attr('href'),
            })
            .done(function(data){
                
                let likesCount=parseInt($(self).attr('data-likes'));
                
                if(data.data.deleted){
                    likesCount-=1;
                }else{
                    likesCount+=1;
                }
                $(self).attr('data-likes',likesCount);
                $(`#like-count-${data.data.likeableId}-${data.data.type}`).html(`${likesCount}`);
            })
            .fail(function(errData){
                console.log('error in completing the request',errData);
            })
        });
    }
}