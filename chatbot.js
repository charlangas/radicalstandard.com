// Create a variable to store the conversation history
let chatLog = [];

// Function to display a message in the chat log
function displayMessage(message, role, typing = false) {
  const chatLogElement = document.getElementById('chat-log');
  const isScrolledToBottom = chatLogElement.scrollHeight - chatLogElement.clientHeight <= chatLogElement.scrollTop + 1;

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble');
  messageBubble.classList.add(role);
  messageBubble.innerHTML = message;

  messageContainer.appendChild(messageBubble);

  chatLogElement.appendChild(messageContainer);

  if (typing && role === 'assistant') {
    // Add typing animation class to empty assistant message bubble
    messageBubble.classList.add('typing');
  }

  if (isScrolledToBottom) {
    chatLogElement.scrollTop = chatLogElement.scrollHeight - chatLogElement.clientHeight;
  }

  return messageContainer; // Return the message container element
}

displayMessage("👋 Hi! I am Radical Standard's AI. You can ask me anything about our services!", 'assistant');

// Function to format a message for display
function formatMessage(message) {
  return `<div><strong>${message.role}:</strong> ${message.content}</div>`;
}

// Function to send the user's message to the OpenAI API
async function sendMessage(message) {
  displayMessage(`${message}`, 'user');

  const assistantMessageContainer = displayMessage('• • •', 'assistant', true); // Display empty assistant message container with typing animation

  const response = await fetch('/.netlify/functions/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    })
  });

  const data = await response.json();
  const completion = data.message;

  setTimeout(() => {
    assistantMessageContainer.querySelector('.message-bubble').classList.remove('typing'); // Remove the typing animation class
    assistantMessageContainer.querySelector('.message-bubble').innerHTML = `${completion}`; // Update the content of the assistant message bubble
  }, 1000);
}


// Function to get a cookie
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Function to check if a user can send a message
function canSendMessage() {
  // Get the start time and message count from the cookies
  const startTime = parseInt(getCookie('startTime'));
  const messageCount = parseInt(getCookie('messageCount'));

  // If the cookies don't exist, set them and return true
  if (isNaN(startTime) || isNaN(messageCount)) {
    setCookie('startTime', Date.now(), 1);
    setCookie('messageCount', 1, 1);
    return true;
  }

  // If 24 hours has passed, reset the cookies and return true
  if (Date.now() - startTime >= 24*60*60*1000) {
    setCookie('startTime', Date.now(), 1);
    setCookie('messageCount', 1, 1);
    return true;
  }

  if (Date.now() - startTime >= 24*60*60*1000) {
    setCookie('startTime', Date.now(), 1);
    setCookie('messageCount', 1, 1);
    document.getElementById('send-button').disabled = false; // Enable the send button
    return true;
  }

  // If the user has sent less than 25 messages, increment the message count and return true
  if (messageCount < 25) {
    setCookie('messageCount', messageCount + 1, 1);
    return true;
  }

  // Otherwise, return false
  return false;
}

// Function to handle user input
function handleUserInput() {
  const userInput = document.getElementById('user-input');
  const message = userInput.textContent.trim();
  const sendButton = document.getElementById('send-button');

  if (message !== '' && canSendMessage()) {
    userInput.textContent = '';
    sendMessage(message);
  } else {
    sendButton.disabled = true; // Disable the send button
    displayMessage(`I'm sorry, I can't answer any more questions today. If you want to learn more about Radical Standard, please <a href="https://calendly.com/your-calendar-link" class="chat-link">📅 schedule a meeting now</a> or <a href="mailto:carlos@radicalstandard.com" class="chat-link">✉️ email us</a>`, 'assistant');
  }

  // Reset the height of the user input box
  userInput.style.height = 'auto';
}


// Event listener for the send button
document.getElementById('send-button').addEventListener('click', handleUserInput);

// Event listener for the Enter key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleUserInput();
  }
});

/*
FEATURES TO ADD
- Add suggested messages to the bottom of the chat so that users can click on them instead of typing
- Allow user to book a call through the same interface?
*/