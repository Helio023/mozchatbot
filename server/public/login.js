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

const production_url = 'https://mozbotchat.onrender.com';
// const dev_url = 'http://localhost:3000/login';

const login = (email, password) => {
  btn.textContent = 'Entrando...';

  axios({
    method: 'POST',
    url: `${production_url}/login`,
    data: {
      email,
      password,
    },
  })
    .then(() => {
      btn.textContent = "Enviar"
      showAlert('success', 'Usuário logado com sucesso!');
      setTimeout(() => {
        window.location.assign('/chat');
      }, 3000);
    })
    .catch((error) => {
      btn.textContent = 'Enviar'
      showAlert('error', error.response?.data);
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  login(email.value, password.value);
});
