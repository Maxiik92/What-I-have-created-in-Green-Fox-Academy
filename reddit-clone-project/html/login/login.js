const pass = document.querySelector('p');
const pwField = document.getElementById('password');
const header = document.getElementById('header');

header.addEventListener('click', (e) => {
  document.location.href = '/';
});

pass.addEventListener('mousedown', () => {
  pwField.type = 'text';
});
pass.addEventListener('mouseup', () => {
  pwField.type = 'password';
});

function loggedAndHome() {
  form.textContent = "";
  const newContent = document.createElement("h2");
  newContent.textContent = "Succesfully Logged in";
  form.appendChild(newContent);
  setTimeout(() => {
    document.location.href = "/";
  }, 3000);
};

function badLogin() {
  form.textContent = "";
  const newContent = document.createElement("h2");
  newContent.textContent = "Wrong Username or Password";
  form.appendChild(newContent);
  setTimeout(() => {
    document.location.href = "/login/login.html";
  }, 2000);
}

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const acc = {
    name: e.target[0].value,
    user_password: e.target[1].value
  };
  checkAcc(acc);
  if (window.localStorage.user_id == 'undefined'|| window.localStorage.user_id == 1) {
    badLogin();
    return;
  } else {
    loggedAndHome();
  };
});

function checkAcc(acc) {
  fetch('/check', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(acc)
  })
    .then(res => res.json())
    .then(user_data => {
      window.localStorage.setItem('user_id', `${user_data.user_id}`);
    });
};
