{

    let expandComment=function(commentBtn){
        commentBtn.click(function(event){
            event.preventDefault();
            var commentId=this.getAttribute('post-id');
            var temp='post-comments-'
            commentId=temp+commentId;
            let commentSection=document.getElementById(commentId);
            commentSection.classList.toggle("hidden");
            if(this.innerText=='Comments'){
                this.innerText='Show Less'
            }else{
                this.innerText='Comments'
            }
        });
    }

    let commentDisplayBtns = $('.comments-btn');
    // console.log(commentDisplayBtns);
    for(let i = 0 ; i<commentDisplayBtns.length  ; i++){

        expandComment($(commentDisplayBtns[i]));

    }
  

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

    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    // console.log(data.data.post);
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    new PostComments(data.data.post._id);
                    successFlash(data.message);
                    expandComment($(`#btn-${data.data.post._id}`));
                    new ToggleLike($(' .like-btn-link',newPost));
                },error : function(err){
                    console.log(err.responseText);
                    errorFlash(err.responseText);
                }
            });
        });
    }

    let newPostDom=function(post){
        return $(`

            <li id="post-${post._id}" class="posts-display">
            <p>
                ${post.content}                              
            <br>
                ${post.user.name}
            </p>
        
            <div class="post-btns">
                
            <a href="/likes/toggle/?id=${post._id }&type=Post" data-likes="${post.likes.length}" class="like-btn-link">
                <button class="like-btn"> 
                    <span id="like-count-${post._id}-Post"> ${post.likes.length}</span> 
                    &nbsp 
                    <i class="fa-solid fa-heart"></i>   
                </button>
            </a>    
                
                <button class="comments-btn" post-id="${post._id}" id="btn-${post._id}">Comments</button>
        
                <a href="/posts/destroy/${post._id}" class="delete-post-button">
                    <button class='delete-post-btn' >Delete</button>
                </a>
                
            </div>
            
            <div class="post-comments">
                
                    <form id="post-${post._id}-comments-form" action="/comments/create" method="post">
                        <input type="text" name="content" placeholder="Add Comment" required>
                        <!-- id of post on which comment is made -->
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>
                 
            </div>
            <div class="post-comments-list ">
                <ul id="post-comments-${post._id}" class="hidden">
                    
                </ul>
            </div>
        </li>`
                
            );
        }

        let deletePost=function(deleteLink){
            
            $(deleteLink).click(function(e){
                e.preventDefault();
                console.log(deleteLink);
                $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success: function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    successFlash(data.message);
                },
                error: function(err){
                    console.log(err.responseText);
                    errorFlash(err.responseText);
                }
            });
        }); 
    }


    //  All posts to Ajax
    let convertPostsToAjax=function(){
        $('#posts-list-container>ul>li').each(function(){

            let self=$(this); // this post
            let postId=self.attr('id').split("-")[1];
            let deleteButton=$(' .delete-post-button',self);

            deletePost(deleteButton);
            new PostComments(postId);
        });
    }

        createPost();
        convertPostsToAjax();

}