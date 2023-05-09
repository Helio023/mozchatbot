const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authSchema');
const catchAsyncError = require('../utils/catchAsync');


exports.home = catchAsyncError(async (req, res) => {
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

    return res.status(200).redirect('chat');
  }
  return res.status(200).render('login');
})

exports.register = catchAsyncError(async (req, res) => {
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
    res.locals.user = currentUser
    return res.status(200).redirect('chat');
  }
  
  return res.status(200).render('register');
})

exports.chat = catchAsyncError(async (req, res) => {
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
    res.locals.user = currentUser
    return res.status(200).render('chat', {
      user: currentUser
    });
  }
  
  return res.status(400).redirect('login');
  
})
