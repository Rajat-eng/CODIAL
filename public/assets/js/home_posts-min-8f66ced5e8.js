{let t=function(t){t.click(function(t){t.preventDefault();var n=this.getAttribute("post-id");n="post-comments-"+n,document.getElementById(n).classList.toggle("hidden"),"Comments"==this.innerText?this.innerText="Show Less":this.innerText="Comments"})},n=$(".comments-btn");for(let e=0;e<n.length;e++)t($(n[e]));let e=function(t){new Noty({theme:"mint",text:t,type:"alert",layout:"topRight",timeout:1500}).show()},s=function(t){new Noty({theme:"mint",text:t,type:"error",layout:"topRight",timeout:1500}).show()},o=function(){let n=$("#new-post-form");n.submit(function(o){o.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:n.serialize(),success:function(n){let s=i(n.data.post);$("#posts-list-container>ul").prepend(s),l($(" .delete-post-button",s)),new PostComments(n.data.post._id),e(n.message),t($(`#btn-${n.data.post._id}`)),new ToggleLike($(" .like-btn-link",s))},error:function(t){console.log(t.responseText),s(t.responseText)}})})},i=function(t){return $(`\n\n            <li id="post-${t._id}" class="posts-display">\n            <p>\n                ${t.content}                              \n            <br>\n                ${t.user.name}\n            </p>\n        \n            <div class="post-btns">\n                \n            <a href="/likes/toggle/?id=${t._id}&type=Post" data-likes="${t.likes.length}" class="like-btn-link">\n                <button class="like-btn"> \n                    <span id="like-count-${t._id}-Post"> ${t.likes.length}</span> \n                    &nbsp \n                    <i class="fa-solid fa-heart"></i>   \n                </button>\n            </a>    \n                \n                <button class="comments-btn" post-id="${t._id}" id="btn-${t._id}">Comments</button>\n        \n                <a href="/posts/destroy/${t._id}" class="delete-post-button">\n                    <button class='delete-post-btn' >Delete</button>\n                </a>\n                \n            </div>\n            \n            <div class="post-comments">\n                \n                    <form id="post-${t._id}-comments-form" action="/comments/create" method="post">\n                        <input type="text" name="content" placeholder="Add Comment" required>\n                        \x3c!-- id of post on which comment is made --\x3e\n                        <input type="hidden" name="post" value="${t._id}">\n                        <input type="submit" value="Add Comment">\n                    </form>\n                 \n            </div>\n            <div class="post-comments-list ">\n                <ul id="post-comments-${t._id}" class="hidden">\n                    \n                </ul>\n            </div>\n        </li>`)},l=function(t){$(t).click(function(n){n.preventDefault(),console.log(t),$.ajax({type:"get",url:$(t).prop("href"),success:function(t){$(`#post-${t.data.post_id}`).remove(),e(t.message)},error:function(t){console.log(t.responseText),s(t.responseText)}})})},a=function(){$("#posts-list-container>ul>li").each(function(){let t=$(this),n=t.attr("id").split("-")[1],e=$(" .delete-post-button",t);l(e),new PostComments(n)})};o(),a()}