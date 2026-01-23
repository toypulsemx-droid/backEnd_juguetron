const express = require('express')
const router = express.Router()

const { clipController } = require('../Controllers/index')


router.post('/clip/create-payment', clipController.payClip)
router.get('/clip/consulta/:paymentId', clipController.consultarPago3DS);

module.exports = router