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
