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
  client.used_tokens = 0;
  client.max_tokens = 500000;
  client.purchased_issued_at = new Date();
  client.purchased_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await client.save({ validateBeforeSave: false });

  const inviter = await User.findOne({ username: client.invitedBy });
  if (inviter) {
    inviter.numOfFriends = inviter.numOfFriends + 1;
    await inviter.save({ validateBeforeSave: false });
  }

  schedule.scheduleJob(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), async () => {
    
    try {
      const proUser = await User.findById(client._id);
      proUser.status = false;
      proUser.max_tokens = undefined;
      proUser.used_tokens = undefined;
      proUser.purchased_expires_at = undefined;
      proUser.purchased_issued_at = undefined;

      await proUser.save({ validateBeforeSave: false });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Algo deu muito errado ao expirar a recarga.',
      });
    }
  });

  return res.status(200).json({
    status: 'success',
    message: 'Conta recarregada com sucesso!',
  });
});

exports.cancelRecharge = catchAsync(async (req, res, next) => {
  try {
    const proUser = await User.findOne({ email: req.body.email });

    if (!req.body.email) {
      return next(
        new SendOperationalError(
          'Especifique o email que pretende cancelar',
          400
        )
      );
    }
    proUser.status = false;
    proUser.max_tokens = undefined;
    proUser.used_tokens = undefined;
    proUser.purchased_expires_at = undefined;
    proUser.purchased_issued_at = undefined;

    await proUser.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Recarga cancelada com sucesso!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao cancelar a recarga',
    });
  }
});
