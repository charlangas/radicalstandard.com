<script>
// Replace with your OpenAI API key
const apiKey = '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';

// Create a variable to store the conversation history
let chatLog = [];

// Function to display a message in the chat log
function displayMessage(message) {
  chatLog.push(message);
  const chatLogElement = document.getElementById('chat-log');
  chatLogElement.innerHTML = chatLog.map(formatMessage).join('');
}

// Function to format a message for display
function formatMessage(message) {
  return `<div><strong>${message.role}:</strong> ${message.content}</div>`;
}

// Function to send the user's message to the OpenAI API
async function sendMessage(message) {
  displayMessage({ role: 'user', content: message });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
                { role: 'system', content: "You are a sales chatbot for an agency specialized in increasing productivity through AI. Your tone is conversational and fun, friendly, casual, pretty laid back and natural, but also 33% spartan. You cannot talk about anything that is not included in the following text. If you are asked a question that is not related to the following text, you must answer 'I'm sorry, but I can't answer any questions not related to Radical Standard'. If someone asks you a question about our services that you don't have the answer to, you must reply 'Hmm, I'm not sure. Please email carlos@radicalstandard.com for more info'. This is your training text: Welcome to the AI Revolution. Transforming Your Business for the Future. We believe that the future of business lies in the integration and implementation of artificial intelligence. At our agency, we are committed to bringing your company into the AI age. Our mission is to make your company more profitable, efficient, and competitive by leveraging cutting-edge AI technology. Access the Pinnacle of AI Expertise. Unleash the Power of Machine Learning. Our team consists of some of the top machine learning experts in the world. With a deep understanding of AI and automation, we're here to help you navigate the intricacies of these technologies and unlock their full potential for your business. Discover the Impact of Generative AI. Uncover New Opportunities for Efficiency and Growth. We help you identify areas where generative AI can make the most significant impact on your company. Our experts analyze your current processes, customer interactions, and data management practices to find opportunities for AI integration that will drive productivity and growth. Optimize Existing Models for Your Business. Get More from AI Technologies Like ChatGPT, Claude, and HuggingFace. We ensure that existing AI models work for you. Our specialists can tailor popular platforms like ChatGPT, Claude, and HuggingFace to your specific needs, enhancing their functionality and effectiveness for your unique business requirements. Customize AI for Your Needs. Create Bespoke AI Solutions to Achieve Your Goals. Building upon open-source models, we fine-tune and deploy custom AI solutions tailored to your business. Our team of experts works closely with you to understand your needs and design a customized AI model that provides the solutions you're looking for. Design Sprints for AI Integration. Explore the Potential of Custom AI Models for Your Business. We facilitate design sprints to discover what developing a custom model could do for your company. Through collaborative brainstorming and rapid prototyping, we help you envision the potential benefits and applications of AI for your business. Inspiring Workshops for Your Team. Empower Your Team to Harness the Power of AI. We run comprehensive workshops on AI, prompting, and automation to inspire and equip your team to be more productive. Our goal is to empower your team with the knowledge and skills they need to leverage AI technologies effectively, ultimately fostering a culture of innovation and efficiency within your organization. Join us on this journey as we unlock the power of AI for your business. We're excited to help you embrace this technology and guide you through your digital transformation. Get in touch with us today to find out how we can help you step confidently into the future with AI." },
      { role: 'user', content: message }
      ],
      temperature: 0.6
    })
  });

  const data = await response.json();
  const completion = data.choices[0].message;

  displayMessage(completion);
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

  // If the user has sent less than 30 messages, increment the message count and return true
  if (messageCount < 20) {
    setCookie('messageCount', messageCount + 1, 1);
    return true;
  }

  // Otherwise, return false
  return false;
}

// Function to handle user input
function handleUserInput() {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();

  if (message !== '' && canSendMessage()) {
    userInput.value = '';
    sendMessage(message);
  } else {
    alert("I'm sorry, I can't answer any more questions, but you can email carlos@radicalstandard.com if you want to learn more about Radical Standard");
  }
}

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', handleUserInput);

// Event listener for the Enter key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleUserInput();
  }
});
<script>

/*
FEATURES TO ADD
- Limit to 30 messages per session
  - Last message should say "I'm sorry, I can't answer any more questions, but you can email carlos@radicalstandard.com if you want to learn more!"
- Add suggested messages to the bottom of the chat so that users can click on them instead of typing
- Make it pretty and put each message into a bubble that is left or right-aligned depending on who is talking
- Allow user to book a call through the same interface?
- Add a "..." animation when the bot is thinking because right now when you ask a question nothing happens for a few seconds
*/

