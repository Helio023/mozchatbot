const schedule = require('node-schedule');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/authSchema');
const SendOperationalError = require('../utils/sendOperationalError');

exports.rechargeAccount = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new SendOperationalError('Especifique o email', 404));
  }

  const client = await User.findOne({ email: req.body.email });

  if (!client) {
    return next(new SendOperationalError('Usuário não encontrado', 404));
  }

  client.status = true;
  client.purchased_issued_at = new Date();
  client.purchased_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await client.save({ validateBeforeSave: false });
  
  const j = schedule.scheduleJob(client.purchased_expires_at, async () => {
    try {
      const proUser = await User.findById(client._id);
      proUser.status = false;
      proUser.purchased_expires_at = undefined;
      proUser.purchased_issued_at = undefined;

      await proUser.save({ validateBeforeSave: false });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Algo deu muito errado ao expirar a recarga.'
      })
    }
  });

  return res.status(200).json({
    status: 'success',
    message: 'Conta recarregada com sucesso!',
  });
});
