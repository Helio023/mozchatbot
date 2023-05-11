const form = document.querySelector('#form');
const btn = document.querySelector('button');

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

const url = 'https://mozbotchat.onrender.com';
// const url = 'http://localhost:3000';

const recharge = (email) => {
  btn.textContent = 'Recarregando...';

  axios({
    method: 'POST',
    url: `${url}/recharge`,
    data: {
      email,
    },
  })
    .then(() => {
      btn.textContent = 'Recarregar';
      showAlert('success', 'Conta recarregada com sucesso!');
    })
    .catch((error) => {
      btn.textContent = 'Recarregar';
      showAlert('error', error.response?.data);
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');

  recharge(email.value);
});
