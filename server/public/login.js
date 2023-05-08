const form = document.querySelector('#form');

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/login',
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
    console.log(error.response.data);
  }
}

