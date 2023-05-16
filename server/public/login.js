const form = document.querySelector('#form');
const btn = document.querySelector('#btn');

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

const login = (email, password) => {
  btn.textContent = 'Entrando...';

  axios({
    method: 'POST',
    url: `${url}/login`,
    data: {
      email,
      password,
    },
  })
    .then(() => {
      btn.textContent = 'Enviar';
      showAlert('success', 'Usuário logado com sucesso!');
      setTimeout(() => {
        window.location.assign('/chat');
      }, 3000);
    })
    .catch((error) => {
      btn.textContent = 'Enviar';
      showAlert('error', error.response?.data?.message?.split('. ')[0]);
    
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  login(email.value, password.value);
});
