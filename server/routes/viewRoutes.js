const router = require('express').Router();
const { isLoggedIn, protectRoutes } = require('../controllers/authController');
const { home, register, chat } = require('../controllers/viewController');

// router.use(isLoggedIn)
router.route('/').get(isLoggedIn,home);
router.route('/register').get(register);
router.route('/chat').get(protectRoutes, isLoggedIn, chat);

module.exports = router;
