document.addEventListener('DOMContentLoaded', (e) => {
  const header = document.getElementById('header');

  header.addEventListener('click', (e) => {
    document.location.href = '/';
  });

  const form = document.querySelector('form');
  const title = document.getElementById('title');
  const post_body = document.getElementById('post_body');

  const queryId = new URLSearchParams(window.location.search).get('post_id');

  function youOrMe(param) {
    if(!param){
      return 1;
    };
    return param;
  };

  fetch(`/posts/${queryId}`)
    .then(res => res.json())
    .then(data => {
      title.textContent = data[0].title;
      post_body.value = data[0].post_body;
    });

  function goHome() {
    form.textContent = "";
    const newContent = document.createElement("h2");
    newContent.textContent = "Succesfully Updated";
    const goHome = document.createElement('a');
    goHome.textContent = "Go back to HomePage";
    form.appendChild(newContent);
    form.appendChild(goHome);
    goHome.addEventListener('click', (e) => {
      document.location.href = "/";
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const post = {
      user_id: youOrMe(window.localStorage.user_id),
      title: e.target[1].value,
      post_body: e.target[2].value
    };
    console.log(post);
    updatePost(post);
    goHome();
  });

  function updatePost(post) {
    fetch(`/user/${post.user_id}/posts/${queryId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(post)
    });
  }
});