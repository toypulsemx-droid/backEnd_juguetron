const Order = require('../../models/orderModel')
const sendOrderNotification = require('../emailController/sendOrderNotification');

const crearOrden = async (req, res) => {
  try {
    const {
      personal,
      envio,
      factura,
      pago,
      total,
      cantidad
    } = req.body

    // Validaciones mínimas (backend SIEMPRE valida)
    if (!personal?.email || !personal?.nombre || !personal?.apellido || !personal?.telefono) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos personales obligatorios'
      })
    }

    if (!total) {
      return res.status(400).json({
        ok: false,
        message: 'El total es obligatorio'
      })
    }

    const nuevaOrden = new Order({
      personal,
      envio,
      factura,
      pago,
      total,
      cantidad
    })

    const ordenGuardada = await nuevaOrden.save()
    await sendOrderNotification(ordenGuardada);

    res.status(201).json({
      ok: true,
      message: 'Orden creada correctamente',
      orden: ordenGuardada
    })

  } catch (error) {
    console.error('Error al crear la orden:', error)

    res.status(500).json({
      ok: false,
      message: 'Error interno al crear la orden'
    })
  }
}

module.exports = crearOrden

