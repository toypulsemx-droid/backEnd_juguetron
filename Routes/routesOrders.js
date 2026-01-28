const express = require('express')
const router = express.Router()
const {orderController} = require('../Controllers/index')

// const authMiddleware = require('../middlewares/authMiddleware')


router.post('/user/order-create',  orderController.createOrder )


module.exports = router