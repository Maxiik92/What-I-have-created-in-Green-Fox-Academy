
document.addEventListener('DOMContentLoaded', (e) =>{

const form = document.querySelector('form');
const header = document.getElementById('header');

header.addEventListener('click',(e) => {
  document.location.href = '/';
});
function youOrMe(param) {
  if(!param){
    return 1;
  };
  return param;
};

function goHome() {
  form.textContent = "";
  const newContent = document.createElement("h2");
  newContent.textContent = "Succesfully Posted";
  const goHome = document.createElement('a');
  goHome.textContent = "Go back to HomePage";
  form.appendChild(newContent);
  form.appendChild(goHome);
  goHome.addEventListener('click',() => {
    document.location.href="/";
  });
};

form.addEventListener('submit',(e) => {
  e.preventDefault();
  const post = {
    user_id: youOrMe(window.localStorage.user_id),
    title: e.target[1].value,
    post_body: e.target[2].value
  };
  addPost(post);
  goHome();
});

function addPost(post) {
  fetch(`/user/${post.user_id}/posts`,{
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(post)
  })
  .then(res => res.json())
};
});