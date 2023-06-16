const { protectRoutes, restrictTo } = require('../controllers/authController');
const { rechargeAccount, cancelRecharge, getExpiredUsers } = require('../controllers/adminController');

const router = require('express').Router();

router
  .route('/recharge')
  .post(protectRoutes, restrictTo('admin'), rechargeAccount);
  
router
  .route('/cancel')
  .post(protectRoutes, restrictTo('admin'), cancelRecharge);

router
  .route('/expired-users')
  .get(protectRoutes, restrictTo('admin'), getExpiredUsers);

module.exports = router;









