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

async function login(email, password) {
  const production_url = 'https://mozbotchat.onrender.com/login';
  // const dev_url = 'http://localhost:3000/login';
  let isLoading;
  try {
    isLoading = true;
    const res = await axios({
      method: 'POST',
      url: production_url,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      isLoading = false;
      showAlert('success', 'Usuário logado com sucesso!');
      setTimeout(() => {
        window.location.assign('/chat');
      }, 3000);
    }
  } catch (error) {
    isLoading = false;
    showAlert('error', error.response.data);
  }

  btn.textContent = `${isLoading ? 'Entrando...' : 'Entrar'}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  login(email.value, password.value);
});
