
document.addEventListener('DOMContentLoaded', async function () {
    getPosts();
    
    document.querySelector('#post-form-submit-btn').addEventListener('click', function () {
        let data = JSON.stringify({
            user: `${document.querySelector('#post-username').value}`,
            body: `${document.querySelector('#post-body').value}`
        });
        fetch('/api/addpost', { method: "POST", body: data })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                getPosts();
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                document.querySelector('#post-username').value = "";
                document.querySelector('#post-body').value = "";
            }
            );
    });

    document.querySelector('#view-all-posts').addEventListener('click', () => {
        document.querySelector('#post-form-div').style.display = "none";
    });
});

function getPosts() {

    fetch(`/api/showposts`)
        .then(response => response.json())
        .then(posts => {
            console.log(posts["posts"]);
            posts["posts"].forEach(post => {
                let postIndex = posts["posts"].indexOf(post);
                let postDiv = document.createElement("div");
                let singlePostDiv = document.createElement("div");
                singlePostDiv.id = `post-div-${postIndex}`;

                // let postUserContainer = document.createElement("a");
                let postUser = document.createElement("a");
                postUser.id = `post-username-${postIndex}`;
                postUser.innerHTML = `${post.user}`;
                postUser.href = `/profile/${post.user}`;
                // postUserContainer.appendChild(postUser);
                let postBody = document.createElement("p");
                postBody.id = `post-body-${postIndex}`;
                postBody.innerHTML = `${post.body}`;
                let postCreatedAt = document.createElement("p");
                postCreatedAt.id = `post-created-at-${postIndex}`;
                let postLike = document.createElement("p");
                postLike.id = `post-like-${postIndex}`;
                postLike.innerHTML = `Like : ${post.like}`;
                singlePostDiv.appendChild(postUser);
                singlePostDiv.appendChild(postBody);
                singlePostDiv.appendChild(postCreatedAt);
                singlePostDiv.appendChild(postLike);
                singlePostDiv.style.border = "2px solid black";
                singlePostDiv.style.margin = "10px";
                singlePostDiv.style.padding = "10px";
                singlePostDiv.style.borderRadius = "10px";
                singlePostDiv.style.boxShadow = "0px 0px 10px black";
                singlePostDiv.style.width = "80%";
                singlePostDiv.style.marginLeft = "10%";
                singlePostDiv.style.marginTop = "10px";
                singlePostDiv.style.marginBottom = "10px";
                singlePostDiv.style.display = "flex";
                singlePostDiv.style.flexDirection = "column";
                singlePostDiv.style.justifyContent = "space-between";
                singlePostDiv.style.alignItems = "center";
                singlePostDiv.style.fontSize = "20px";
                if (postIndex % 2 == 0) { postUser.style.backgroundColor="#E9E454"; singlePostDiv.style.backgroundColor = "#E9E454"; } else {postUser.style.backgroundColor="#D56363"; singlePostDiv.style.backgroundColor = "#D56363"; }
                singlePostDiv.style.fontFamily = "open sans";
                singlePostDiv.style.color = "black";
                
                // postUser.addEventListener('click', () => {
                    
                // });

                let likeBtn = document.createElement("button");
                likeBtn.id = `like-btn-${postIndex}`;
                likeBtn.style.margin = "10px";
                if (post.like == 0) {
                    likeBtn.innerHTML = "Like";
                    likeBtn.style.backgroundColor = "blue";
                    likeBtn.style.color = "white";
                } else {
                    likeBtn.innerHTML = "Unlike";
                    likeBtn.style.backgroundColor = "red";
                    likeBtn.style.color = "white";
                }
                likeBtn.addEventListener('click', function () {
                    if (likeBtn.innerHTML == "Like") {
                        likeBtn.innerHTML = "Unlike";
                        likeBtn.style.backgroundColor = "red";
                        likeBtn.style.color = "white";
                        let like = parseInt(postLike.innerHTML.split(":")[1]);
                        like++;
                        postLike.innerHTML = `Like : ${like}`;

                        let data = JSON.stringify({
                            user: `${document.querySelector('#post-username').value}`
                        });
                        fetch(`/api/likepost/${postIndex}`, { method: "POST", body: data })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                    } else {
                        likeBtn.innerHTML = "Like";
                        likeBtn.style.backgroundColor = "blue";
                        likeBtn.style.color = "white";
                        let like = parseInt(postLike.innerHTML.split(":")[1]);
                        like--;
                        postLike.innerHTML = `Like : ${like}`;
                        fetch(`/api/unlikepost/${postIndex}`, { method: "POST" })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                    }
                });
                singlePostDiv.appendChild(likeBtn);
                if (user == post["user"]) {
                    let editBtn = document.createElement("button");
                    editBtn.id = `edit-btn-${postIndex}`;
                    editBtn.innerHTML = "Edit";
                    editBtn.addEventListener('click', () => {
                        editPost(postIndex);
                    });
                    singlePostDiv.appendChild(editBtn);
                }

                postDiv.appendChild(singlePostDiv);
                document.querySelector('#post-view').appendChild(postDiv);
            });

        });
}

function editPost(postIndex) {
    let postBody = document.querySelector(`#post-body-${postIndex}`);
    let preLoadData = postBody.innerHTML;

    let editTextArea = document.createElement("textarea");
    editTextArea.id = `edit-text-area-${postIndex}`;
    editTextArea.value = preLoadData;

    postBody.style.display = "none";
    document.querySelector(`#edit-btn-${postIndex}`).style.display = "none";
    document.querySelector(`#like-btn-${postIndex}`).style.display = "none";

    let editTextAreaSaveBtn = document.createElement("button");
    editTextAreaSaveBtn.id = `edit-text-area-save-btn-${postIndex}`;
    editTextAreaSaveBtn.innerHTML = "Save";
    editTextAreaSaveBtn.addEventListener('click', () => {
        postBody.innerHTML = editTextArea.value;
        editTextArea.style.display = "none";
        editTextAreaSaveBtn.style.display = "none";
        postBody.style.display = "block";
        document.querySelector(`#edit-btn-${postIndex}`).style.display = "block";
        document.querySelector(`#like-btn-${postIndex}`).style.display = "block";

        data = JSON.stringify({
            user: `${document.querySelector(`#post-username-${postIndex}`).innerHTML}`,
            body: `${editTextArea.value}`
        });
        fetch(`/api/editpost/${postIndex}`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    });

    let singlePostDiv = document.querySelector(`#post-div-${postIndex}`);
    singlePostDiv.appendChild(editTextArea);
    singlePostDiv.appendChild(editTextAreaSaveBtn);
}