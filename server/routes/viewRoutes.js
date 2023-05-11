const router = require('express').Router();
const { isLoggedIn, protectRoutes } = require('../controllers/authController');
const { home, register, chat, recharge, notfound } = require('../controllers/viewController');

// router.use(isLoggedIn)
router.route('/').get(home);
router.route('/notfound').get(notfound);
router.route('/register').get(register);
router.route('/chat').get(protectRoutes, isLoggedIn, chat);
router.route('/recharge').get(protectRoutes, isLoggedIn, recharge);

module.exports = router;
