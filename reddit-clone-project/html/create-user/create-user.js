const pass = document.querySelector('p');
const pwField = document.getElementById('password');
const header = document.getElementById('header');

header.addEventListener('click', (e) => {
  document.location.href = '/';
});

pass.addEventListener('mousedown', () => {
  pwField.type = 'text';
})
pass.addEventListener('mouseup', () => {
  pwField.type = 'password';
})

document.addEventListener('DOMContentLoaded', (e) => {
  const form = document.querySelector('form');

  function goHome() {
    form.textContent = "";
    const newContent = document.createElement("h2");
    newContent.textContent = "Account created";
    const goHome = document.createElement('a');
    goHome.textContent = "Go back to HomePage";
    form.appendChild(newContent);
    form.appendChild(goHome);
    goHome.addEventListener('click', () => {
      document.location.href = "/";
    });
  };

  function accExists() {
    form.textContent = "";
    const newContent = document.createElement("h2");
    newContent.textContent = "Account with that UserName already exists";
    form.appendChild(newContent);
    setTimeout(() => {
      document.location.reload();
    }, 2000)
  };


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const acc = {
      name: e.target[0].value,
      user_password: e.target[1].value
    };
    createAcc(acc);
  });

  function createAcc(acc) {
    fetch('/user', {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(acc)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message == "Username already in use") {
          accExists();
        } else {
          goHome();
        };
      });
  };
});