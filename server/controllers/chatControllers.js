const { Configuration, OpenAIApi } = require('openai');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/authSchema');
const SendOperationalError = require('../utils/sendOperationalError');

//openai config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

exports.chat = async (req, res, next) => {
  const prompt = req.body.prompt;
  const user = await User.findOne({email: req.user.email})
  
  if(!user || user.status === false) {
    return next(new SendOperationalError('Este usuário não existe ou a sua conta não está recarregada', 401))
  }

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
      message: "Algo deu errado! Tenta outra vez.",
    });
  }
};

