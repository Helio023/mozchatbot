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

const url = 'https://www.mozbotchat.com';
// const url = 'http://localhost:3000';

const recharge = (email) => {
  btn.textContent = 'Cancelando...';

  axios({
    method: 'POST',
    url: `${url}/cancel`,
    data: {
      email,
    },
  })
    .then(() => {
      btn.textContent = 'Cancelar';
      showAlert('success', 'Recarga cancelada com sucesso!');
    })
    .catch((error) => {
      btn.textContent = 'Recarregar';
      showAlert('error', error.response?.data?.message?.split('. ')[0])
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');

  recharge(email.value);
});
