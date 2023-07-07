const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authSchema');
const catchAsyncError = require('../utils/catchAsync');

// exports.home = catchAsyncError(async (req, res, next) => {
//   if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
//     const promisifyDecoded = promisify(jwt.verify);

//     const decoded = await promisifyDecoded(
//       req.cookies.jwt,
//       process.env.JWT_SECRET
//     );

//     const currentUser = await User.findById(decoded.id);
//     console.log(currentUser);

//     if (!currentUser) {
//       return res.status(200).redirect('login');
//     }

//     if (currentUser.changedPasswordAfterJWT(decoded.iat)) {
//       return res.status(200).redirect('login');
//     }

//     return res.status(200).redirect('chat');
//   }

//   return res.status(200).render('login');
// });

exports.home = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);

      if (!currentUser || currentUser.changedPasswordAfterJWT(decoded.iat)) {
        return res.status(200).redirect('/login');
      }

      return res.status(200).redirect('/chat');
    } catch (error) {
      console.log(error);
      return res.status(200).redirect('/login');
    }
  }

  return res.status(200).render('login');
});



exports.settings = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
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

    return res.status(200).render('settings');
  }

  return res.status(200).redirect('login');
});

exports.expired = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {

    const currentDate = new Date();

    const expiredUsers = await User.find({
      purchased_expires_at: { $lt: currentDate },
    });

    if (!expiredUsers) {
      return next(SendOperationalError('Nenhuma recarga expirada', 404));
    }
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

    return res.status(200).render('expired', {users: expiredUsers});
  }

  return res.status(200).redirect('login');
});

exports.clients = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    const users = await User.find({ invitedBy: req.user.username });
    const freeUsers = users.filter(user => user.status === false);
    const proUsers = users.filter(user => user.status === true);

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

    return res.status(200).render('clients', { users, freeUsers, proUsers });
  }

  return res.status(200).redirect('login');
});

exports.users = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    const users = await User.find();

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

    return res.status(200).render('users', { users });
  }

  return res.status(200).redirect('login');
});

exports.cancel = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    const users = await User.find();

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

    return res.status(200).render('cancel');
  }

  return res.status(200).redirect('login');
});

exports.register = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
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
    return res.status(200).redirect('chat');
  }

  return res.status(200).render('register');
});

exports.chat = catchAsyncError(async (req, res) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
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
    return res.status(200).render('chat', {
      user: currentUser,
    });
  }

  return res.status(400).redirect('login');
});

exports.recharge = catchAsyncError(async (req, res, next) => {
  if (
    req.cookies.jwt &&
    req.cookies.jwt !== 'loggedout' &&
    req.user.role === 'admin'
  ) {
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

    return res.status(200).render('recharge');
  }

  return res.status(400).redirect('/notfound');
});

exports.notfound = catchAsyncError(async (req, res) => {
  res.status(400).render('notfound');
});
