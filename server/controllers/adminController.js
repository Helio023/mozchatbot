const schedule = require('node-schedule');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/authSchema');
const SendOperationalError = require('../utils/sendOperationalError');

const expireRecharge = (expireDate, id) => {
  return schedule.scheduleJob(expireDate, async () => {
    try {
      const proUser = await User.findById(id);
      proUser.status = false;
      proUser.max_tokens = 0;
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
};

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

  expireRecharge(client.purchased_expires_at, client._id);
  return res.status(200).json({
    status: 'success',
    message: 'Conta recarregada com sucesso!',
  });
});
