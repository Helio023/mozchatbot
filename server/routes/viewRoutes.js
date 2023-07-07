const router = require('express').Router();
const { isLoggedIn, protectRoutes } = require('../controllers/authController');
const { home, register, chat, login, recharge, cancel, expired, users, notfound, settings, clients } = require('../controllers/viewController');

// router.use(isLoggedIn)
router.route('/').get(home);
router.route('/notfound').get(notfound);
router.route('/register').get(register);
router.route('/login').get(login);
router.route('/chat').get(protectRoutes, isLoggedIn, chat);
router.route('/recharge').get(protectRoutes, isLoggedIn, recharge);
router.route('/settings').get(protectRoutes, isLoggedIn, settings);
router.route('/clients').get(protectRoutes, isLoggedIn, clients);
router.route('/expired').get(protectRoutes, isLoggedIn, expired);
router.route('/users').get(protectRoutes, isLoggedIn, users);
router.route('/cancel').get(protectRoutes, isLoggedIn, cancel);

module.exports = router;
