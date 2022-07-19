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


class PostComments{
    constructor(postId){
        this.postId=postId;
        this.postContainer=$(`#post-${postId}`);
        this.newCommentForm=$(`#post-${postId}-comments-form`);

        this.createComment(postId);
        let self=this;
        // all comments of post
        $(' .delete-comment-button',this.postContainer).each(function(){
            self.deleteComment($(this));
        })
    }


    createComment(postId){
        let pSelf=this;  // post
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self=this; // comment form
            $.ajax({
                type:'post',
                url:'/comments/create',
                data:$(self).serialize(),

                success: function(data){
                    //console.log(data.data.comment);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                    successFlash(data.message); 
                    new ToggleLike($(' .like-btn-link',newComment)); 
                }, error: function(error){
                    console.log(error.responseText);
                    errorFlash(err.responseText);
                }
            });
        });
    }

    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }" class="comment-display">
        <p>
        ${comment.content}
      <br>
        ${comment.user.name}
      </p>
      
     <div class="comment-btns">
         
              <a href="/likes/toggle/?id=${comment._id}&type=Comment" data-likes="${comment.likes.length}" class="like-btn-link">
                  <button class='like-btn' ><span id='like-count-${ comment._id }-Comment'>${comment.likes.length}</span> &nbsp <i class="fa-solid fa-heart"></i> </button>
              </a>   
          
              <a href="/comments/destroy/${comment._id}" class="delete-comment-button">
                  <button class='delete-comment-btn' >Delete</button>
              </a>
          
     </div>
                </li>`);
    }

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    successFlash(data.message);
                },error: function(err){
                    console.log(error.responseText);
                    errorFlash(err.responseText);
                }
            });
        });
    }


}



