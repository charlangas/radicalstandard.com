const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { message } = JSON.parse(event.body);

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: "You are a sales chatbot for an agency specialized in increasing productivity through AI." },
      { role: 'user', content: `${message}` },
    ],
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

    const completion = response.data.choices[0].text.trim();
    return { statusCode: 200, body: JSON.stringify({ message: completion }) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error calling OpenAI API' }) };
  }
};