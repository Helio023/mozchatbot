const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authSchema');
const catchAsyncError = require('../utils/catchAsync');
const OperationalError = require('../utils/sendOperationalError');

const sendTokenViaCookie = (user, statusCode, req, res, token) => {
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
};

exports.signup = catchAsyncError(async (req, res, next) => {
  const { username, password, passwordConfirm, email, role } = req.body;
  if (!username || !email || !password || !passwordConfirm) {
    return next(new OperationalError('Preencha todos os campos'));
  }

  const user = await User.findOne({ email });

  if (user && user.email === email) {
    return next(new OperationalError('Este email já foi usado.', 409));
  }

  const newUser = await User.create({
    username,
    password,
    passwordConfirm,
    email,
    role,
  });

  if (req.query.inviter) {
    newUser.invitedBy = req.query.inviter;
    await newUser.save({ validateBeforeSave: false });

    await User.findOneAndUpdate(
      { username: req.query.inviter },
      { $push: { invitations: username } },
      { new: true }
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Usuário criado com sucesso',
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new OperationalError('Email e senha obrigatórios.', 403));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkCorrectPassword(password, user.password))) {
    return next(new OperationalError('O email ou a senha está errado!', 401));
  }

  const token = user.createToken(user);

  sendTokenViaCookie(user, 200, req, res, token);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protectRoutes = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(400).redirect('/');
  }

  const promisifyDecoded = promisify(jwt.verify);

  const decoded = await promisifyDecoded(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new OperationalError('Usuário não logado, entra e tenta outra vez.', 401)
    );
  }

  if (currentUser.changedPasswordAfterJWT(decoded.iat)) {
    res.status(400).redirect('/');
  }

  req.user = currentUser;

  next();
});

exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt) {
    const promisifyDecoded = promisify(jwt.verify);

    const decoded = await promisifyDecoded(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }

    if (currentUser.changedPasswordAfterJWT(decoded.iat)) {
      return next();
    }

    res.locals.user = currentUser;
    return next();
  }
  return next();
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new OperationalError(
          'Você não tem permissão para acessar esta rota!',
          403
        )
      );
    }

    next();
  };
};

// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!req.body.email) {
//     return next(new operationalError('Especifique o seu email', 404));
//   }

//   if (!user || !user.verified) {
//     return next(
//       new operationalError(
//         'Não há usuário com este email ou a conta não foi verificada',
//         404
//       )
//     );
//   }

//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   try {
//     const url = `https://www.acendeunocubico.com/reset-password/${resetToken}`;
//     await new Email(user, url).sendPasswordReset();

//     res.status(200).json({
//       status: 'success',
//       message: 'Token enviado para o email!',
//     });
//   } catch (err) {
//     return next(
//       new operationalError(
//         `Houve um erro ao enviar o email. Tenta mais tarde!`
//       ),
//       500
//     );
//   }
// });

// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//   const { password, passwordConfirm } = req.body;

//   if (!password || !passwordConfirm) {
//     return next(
//       new operationalError('Escreva a sua senha e confirme por favor', 400)
//     );
//   }

//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new operationalError('Token inválido ou expirado', 400));
//   }
//   user.password = password;
//   user.passwordConfirm = passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   const token = user.createToken(user);

//   sendTokenViaCookie(user, 200, req, res, token);

//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// });

exports.updateAllUsers = catchAsyncError(async (req, res) => {
  await User.updateMany(
    {},
    { numOfFriends: 0, invitedBy: '', invitations: [] }
  );

  return res.status(201).json({
    status: 'success',
    message: 'Usuários actualizados',
  });
});
