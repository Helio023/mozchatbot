const form = document.querySelector('#register');
const btn = document.querySelector('.register-btn');

function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
}

function showAlert(type, msg) {
  hideAlert();
  const markup = `<div style="text-align: center" class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  setTimeout(() => hideAlert(), 5000);
}

const url = 'https://www.mozbotchat.com';
// const url = 'http://localhost:3000';

const register = (email, password, username, passwordConfirm) => {
  const queryParams = new URLSearchParams(window.location.search);
  const inviter = queryParams.get('inviter');

  btn.textContent = 'Registando...';

  let requestUrl = `${url}/signup`; 

  if (inviter) {
    requestUrl += `?inviter=${inviter}`; 
  }

  axios({
    method: 'POST',
    url: requestUrl,
    data: {
      email,
      password,
      username,
      passwordConfirm,
    },
  })
    .then(() => {
      btn.textContent = 'Registar';
      showAlert('success', 'Usuário registado com sucesso!');
      setTimeout(() => {
        window.location.assign('/chat');
      }, 3000);
    })
    .catch((error) => {
      btn.textContent = 'Registar';
      showAlert('error', error.response?.data?.message?.split('. ')[0]);
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const passwordConfirm = document.querySelector('#password-confirm');
  const username = document.querySelector('#username');

  register(email.value, password.value, username.value, passwordConfirm.value);
});


