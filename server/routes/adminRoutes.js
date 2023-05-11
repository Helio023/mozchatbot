const { protectRoutes, restrictTo } = require('../controllers/authController');
const { rechargeAccount } = require('../controllers/adminController');

const router = require('express').Router();

router
  .route('/recharge')
  .post(protectRoutes, restrictTo('admin'), rechargeAccount);

module.exports = router;









