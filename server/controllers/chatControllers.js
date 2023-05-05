const { Configuration, OpenAIApi } = require('openai');

//openai config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

exports.chat = async (req, res) => {
  const prompt = req.body.body;
 
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.status(200).json({
      bot: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error
    });
  }
}