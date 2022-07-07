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
                    //successFlash(data.message);
                },error : function(err){
                    console.log(err.responseText);
                    //errorFlash(err.responseText);
                }
            });
        });
    }

    
    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                        ${post.content}                              
                        <small>
                          <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete</a>
                        </small>
                            <br>
                                ${post.user.name} 
                    </p>
                            
                    <div class="post-comments">
                            
                        <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
                            <input type="text" name="content" placeholder="Add Comment" required>
                            <!-- id of post on which comment is made -->
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment">
                        </form>
                            
                        </div>
                    <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                                    
                            </ul>
                    </div>
                    </li>`);
        }

        let deletePost=function(deleteLink){

            $(deleteLink).click(function(e){
                e.preventDefault();

                $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success: function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    //successFlash(data.message);

                },
                error: function(err){
                    console.log(err.responseText);
                    //errorFlash(err.responseText);
                }
            });
        }); 
    }


    //  All posts to Ajax
    let convertPostsToAjax=function(){
        $('#posts-list-container>ul>li').each(function(){

            let self=$(this); // this post
            // console.log(self);
            let deleteButton=$(' .delete-post-button',self);
            deletePost(deleteButton);


            let postId=self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }

       createPost();
       convertPostsToAjax();

}