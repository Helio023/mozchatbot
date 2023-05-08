const { protectRoutes } = require('../controllers/authController')
const { chat, rechargeAccount } = require('../controllers/chatControllers')

const router = require('express').Router()

router.route('/prompt').post(chat)
router.route('/recharge').post(protectRoutes,rechargeAccount)

module.exports = router