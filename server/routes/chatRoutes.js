const { chat } = require('../controllers/chatControllers');
const {protectRoutes} = require('../controllers/authController')

const router = require('express').Router();

router.route('/prompt').post(protectRoutes,chat);

module.exports = router;
