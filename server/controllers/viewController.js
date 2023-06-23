const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authSchema');
const catchAsyncError = require('../utils/catchAsync');

exports.home = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    const promisifyDecoded = promisify(jwt.verify);

    const decoded = await promisifyDecoded(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    if(!decoded) {
      return res.status(200).redirect('login');
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }

    if (currentUser.changedPasswordAfterJWT(decoded.iat)) {
      return next();
    }

    return res.status(200).redirect('chat');
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

exports.clients = catchAsyncError(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    const users = await User.find({ invitedBy: req.user.username });

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

    return res.status(200).render('clients', { users });
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
