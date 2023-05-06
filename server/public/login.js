const form = document.querySelector('#form');

async function login(email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://mozbotchat.onrender.com/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      setTimeout(() => {
        window.location.assign('/chat');
      }, 3000);
    }
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  login(email.value, password.value);
});
