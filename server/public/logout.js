const logoutBtn = document.querySelector('#logout-btn');
const url = 'https://mozbotchat.onrender.com';
// const dev_url = 'http://localhost:3000';

const logout = () => {
  axios({
    method: 'GET',
    url: `${url}/logout`,
  }).then(() => {
    window.location.assign('/');
  });
};

if(logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    logout()
  })
}