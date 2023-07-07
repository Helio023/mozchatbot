const {
  signup,
  login,
  logout,
  updateAllUsers,
} = require('../controllers/authController');

const router = require('express').Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
// router.route('/forgot').post(forgotPassword);
router.route('/update-users').post(updateAllUsers);
router.route('/logout').get(logout);

module.exports = router;
