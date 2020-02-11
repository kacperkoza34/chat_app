const loginFrom = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = loginFrom.querySelector('.text-input')
const messageContentInput = addMessageForm.querySelector('.text-input');

let userName;
let messageContent;

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));


// LOGIN
function login (userName) {
  loginFrom.classList.remove('show');
  messagesSection.classList.add('show');
}

// ADD MESSAGE

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

function sendMessage(userName, messageContent) {
  event.preventDefault();
  messageContent = messageContentInput.value;
  userName = userNameInput.value;
  if(messageContent.length){
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
  }
  else window.alert('Type message');
  messageContentInput.value = '';
}

// EVENT LISTNERS
loginFrom.addEventListener('submit', (event) =>{
  userName = userNameInput.value;
  socket.emit('login', { author: userName });
  messageContent = [];
  event.preventDefault();
  if(userName.length) login(userName);
  else window.alert('Type your name!');
});

messagesSection.addEventListener('submit', (event) =>{
  sendMessage(userName, messageContent);
});
