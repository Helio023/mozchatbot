

// const form = document.querySelector('form');
// const chatContainer = document.querySelector('#chat_container');

// let loadInterval;

// function loader(element) {
//   element.textContent = '';
 
//   loadInterval = setInterval(() => {
//     element.textContent += '.';

//     if (element.textContent === '....') {
//       element.textContent = '';
//     }
//   }, 300);
// }

// function typeText(element, text) {
//   let index = 0;

//   let interval = setInterval(() => {
//     if (index < text.length) {
//       element.innerHTML += text.charAt(index);
//       index++;
//     } else {
//       clearInterval(interval);
//     }
//   }, 20);
// }

// function generateRandomId() {
//   const timeStamp = Date.now();
//   const randomNumber = Math.random();
//   const hexadecimalString = randomNumber.toString(16);

//   return `id-${timeStamp}-${hexadecimalString}`;
// }

// function chatStripe(isAi, value, uniqueId) {
 
//   return `
//   <div class="wrapper ${isAi && 'ai'}" >
//     <div class="chat">

//     <div class="profile">
//         <img src="${isAi ? './assets/bot.svg' : './assets/send.svg'}" alt="${
//     isAi ? 'Bot' : 'User'
//   }"/>
        
//     </div>
//     <div class="message" id=${uniqueId}>${value}</div>
//     </div>
  
//   </div>
//   `;
// }
// export const handleSubmit = async (e) => {
//   e.preventDefault();
//   // User message
//   const data = new FormData(form);
//   chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
//   form.reset();

//   // Bot message
//   const uniqueId = generateRandomId();
//   chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
//   chatContainer.scrollTop = chatContainer.scrollHeight;

//   const messageDiv = document.getElementById(uniqueId);

//   loader(messageDiv);

//   const response = await fetch('http://localhost:3000/prompt', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       prompt: data.get('prompt'),
//     }),
//   });

//   clearInterval(loadInterval);
//   messageDiv.innerHTML = '';

//   if (response.ok) {
//     const data = await response.json();

//     const parsedData = data.bot.trim();

//     typeText(messageDiv, parsedData);
//   } else {
//     messageDiv.innerHTML = 'Algo deu errado, tenta outra vez.';
//   }
// };
// if (form) {
//   form.addEventListener('submit', handleSubmit);
//   form.addEventListener('keyup', (e) => {
//     if (e.code === 'Enter') {
//       handleSubmit(e);
//     }
//   });
// }

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateRandomId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(role, value, uniqueId) {
  return `
    <div class="wrapper ${role}">
      <div class="chat">
        <div class="profile">
          <img src="${role === 'ai' ? './assets/bot.svg' : './assets/send.svg'}" alt="${role === 'ai' ? 'Bot' : 'User'}"/>
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `;
}

export const handleSubmit = async (e) => {
  e.preventDefault();
  // User message
  const data = new FormData(form);
  const userMessage = data.get('prompt');
  chatContainer.innerHTML += chatStripe('user', userMessage);
  form.reset();

  // Bot message
  const uniqueId = generateRandomId();
  chatContainer.innerHTML += chatStripe('ai', ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  
  const response = await fetch('https://www.mozbotchat.com/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: userMessage,
      conversation: userMessage, 
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();

    const parsedData = data.bot.trim();

     typeText(messageDiv, parsedData);
  } else {
    messageDiv.innerHTML = 'Algo deu errado, tente outra vez.';
  }
};

if (form) {
  form.addEventListener('submit', handleSubmit);
  form.addEventListener('keyup', (e) => {
    if (e.code === 'Enter') {
      handleSubmit(e);
    }
  });
}

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js')
  //     .then(function() {
  //       console.log('Service Worker registered with scope:');
  //     })
  //     .catch(function(error) {
  //       console.log('Service Worker registration failed:', error);
  //     });
  // }
