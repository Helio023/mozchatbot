const { chat } = require('../controllers/chatControllers');

const router = require('express').Router();

router.route('/prompt').post(chat);

module.exports = router;
