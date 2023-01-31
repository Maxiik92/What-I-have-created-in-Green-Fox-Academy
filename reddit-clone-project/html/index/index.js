const mainContent = document.getElementById('mainContent');
let posts = [];

function getNormalTime(time) {
  let year = time.slice(0, 4);
  let month = time.slice(5, 7);
  let day = time.slice(8, 10);
  let hours = time.slice(11, 19);
  return `Submitted at ${day}.${month}.${year} at ${hours}.`;
};

function renderPost(posts) {
  for (let i = posts.length - 1; i >= 0; i--) {
    //main structure
    const newPost = document.createElement('div');
    newPost.className = "post"
    newPost.setAttribute("data-id", posts[i].post_id)
    newPost.setAttribute("data-user_id", posts[i].user_id)
    const voteSystem = document.createElement('div');
    voteSystem.className = "voteSystem";
    const postBody = document.createElement('div');
    postBody.className = "postBody";
    //votesystem
    const score = document.createElement('p');
    score.textContent = posts[i].votes;
    const upVote = document.createElement('button');
    const upvoteButton = document.createElement('img');
    upvoteButton.src = ".././assets/upvote.png";
    upVote.appendChild(upvoteButton);
    upvoteButton.className = "upvote";
    const downVote = document.createElement('button');
    const downvoteButton = document.createElement('img');
    downvoteButton.src = ".././assets/downvote.png";
    downVote.appendChild(downvoteButton);
    downvoteButton.className = "downvote";
    //post_body
    const title = document.createElement('h2');
    title.className = 'postTitle';
    const titleLink = document.createElement('a');
    titleLink.textContent = posts[i].title;
    titleLink.setAttribute('href', `${posts[i].post_body}`);
    const submitted = document.createElement('p');
    submitted.textContent = `Submitted ${timeAgo(posts[i].post_date)} by ${posts[i].name}`;
    const updatePost = document.createElement('a');
    updatePost.textContent = "Modify";
    updatePost.className = 'modify';
    updatePost.setAttribute('data-route', `../update/update.html?post_id=${posts[i].post_id}`);
    const deletePost = document.createElement('a');
    deletePost.textContent = "Remove";
    deletePost.className = "remove";
    const stats = document.createElement('div');
    const buttons = document.createElement('div');
    stats.className = 'stats'
    stats.appendChild(submitted);
    buttons.appendChild(updatePost);
    buttons.appendChild(deletePost);
    stats.appendChild(buttons);
    //pushing to main body
    voteSystem.appendChild(upVote);
    voteSystem.appendChild(score);
    voteSystem.appendChild(downVote)
    title.appendChild(titleLink)
    postBody.appendChild(title);
    postBody.appendChild(stats);
    newPost.appendChild(voteSystem);
    newPost.appendChild(postBody);

    mainContent.appendChild(newPost);
  };
};

function logOut() {
  window.localStorage.clear();
  document.location.href = '/';
}

function getUsers(userId) {
  fetch(`/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const loginTag = document.getElementById('user').children[1];
      if (data.name == undefined) {
        loginTag.textContent = 'Log in';
        return;
      } else {
        loginTag.textContent = `Logged in as ${data.name}`
        const logout = document.createElement('a');
        const user = document.getElementById('user');
        logout.textContent = 'Log Out'
        logout.setAttribute('onclick', 'logOut()');
        user.appendChild(logout);
      }
    })
    .catch(err => { console.log(err) });
};

function getPosts() {
  fetch("/posts")
    .then(res => res.json())
    .then(allPosts => {
      posts = allPosts;
      renderPost(posts);
    });
};

function youOrMe(param) {
  if (!param) {
    return 1;
  };
  return param;
};

function deletePost(post) {
  const id = youOrMe(window.localStorage.user_id);
  fetch(`/user/${id}/posts/${post.post_id}`, {
    method: 'delete',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(post)
  })
  alert("Post Deleted"),
    location.reload();
};

function upvotePost(post) {
  const id = youOrMe(window.localStorage.user_id);
  fetch(`/user/${id}/posts/${post.post_id}/upvote`, {
    method: 'PATCH',
    body: JSON.stringify(post)
  })
};

function downvotePost(post) {
  const id = youOrMe(window.localStorage.user_id);
  fetch(`/user/${id}/posts/${post.post_id}/downvote`, {
    method: "PATCH",
    body: JSON.stringify(post)
  })
};

//delete post,upvote and downvote
mainContent.addEventListener('click', (e) => {
  let name = e.target.className;

  switch (name) {
    case "remove":
      let parent = e.target.parentNode.parentNode;
      let grandpa = parent.parentNode.parentNode;
      let parentData = grandpa.getAttribute("data-id");
      let parentUserData = parseInt(grandpa.getAttribute("data-user_id"));
      console.log(window.localStorage.user_id)
      if (parentUserData == youOrMe(window.localStorage.user_id)) {
        const toBeDeleted = {
          post_id: parentData
        };
        deletePost(toBeDeleted);
      }
      else {
        alert('Cannot delete a Post which is not yours!');
      };
      break;
    case "modify":
      let daddy = e.target.parentNode.parentNode.parentNode.parentNode;
      let daddyId = parseInt(daddy.getAttribute("data-user_id"));
      if (daddyId != youOrMe(window.localStorage.user_id)) {
        alert('Cannot modify a Post which is not yours!');
      } else {
        window.location.href = e.target.getAttribute('data-route');
      };
      break;
    case "upvote":
      const mommy = parseInt(e.path[3].getAttribute("data-user_id"))
      const toBeUpvoted = {
        post_id: parseInt(e.path[3].getAttribute("data-id"))
      };
      if (mommy == youOrMe(window.localStorage.user_id)) {
        alert('Cannot vote on your posts!');
      } else {
        upvotePost(toBeUpvoted);
        let upvotePic = e.target;
        upvotePic.src = "../assets/upvoted.png";
        let stepsis = e.target.parentNode.nextElementSibling;
        stepsis.textContent = parseInt(stepsis.innerHTML) + 1;
      };
      break;
    case "downvote":
      const someParent = parseInt(e.path[3].getAttribute("data-user_id"))
      const toBeDownvoted = {
        post_id: parseInt(e.path[3].getAttribute("data-id"))
      };
      if (someParent == youOrMe(window.localStorage.user_id)) {
        alert('Cannot vote on your posts!');
      } else {
        downvotePost(toBeDownvoted);
        let downvotePic = e.target;
        downvotePic.src = "../assets/downvoted.png";
        let stepbro = e.target.parentNode.previousElementSibling;
        stepbro.textContent = parseInt(stepbro.innerHTML) - 1
      };
      break;
  };
});

document.addEventListener('DOMContentLoaded', (e) => {
  getPosts();
  getUsers(window.localStorage.user_id);
});