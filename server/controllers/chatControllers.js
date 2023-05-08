const { Configuration, OpenAIApi } = require('openai');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/authSchema');
const SendOperationalError = require('../utils/sendOperationalError');

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
      message: error,
    });
  }
};

exports.rechargeAccount = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });

  if (!user || user.role !== 'admin') {
    return next(new SendOperationalError('Usuário sem permissão.', 404));
  }

  if (!req.body.email) {
    return next(new SendOperationalError('Especifique o email', 404));
  }

  const client = await User.findOne({ email: req.body.email });
 
  if (!client) {
    return next(new SendOperationalError('Usuário não encontrado', 404));
  }

  client.status = true;
  (client.purchased_issued_at = new Date()),
    (client.purchased_expires_at = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ));

  await client.save({validateBeforeSave: false});

  res.status(200).json({
    status: 'success',
    message: 'Conta recarregada com sucesso!',
  });
});

exports.checkUserStatus = async () => {
  const users = await User.find({ active: true });

  users.forEach((user) => {
    if (user.purchased_expires_at < new Date()) {
      user.active = false;
      user.save();
    }
  });
};
