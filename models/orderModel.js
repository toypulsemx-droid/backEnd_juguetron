const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    personal: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      nombre: {
        type: String,
        required: true,
        trim: true
      },
      apellido: {
        type: String,
        required: true,
        trim: true
      },
      telefono: {
        type: String,
        required: true,
        trim: true
      }
    },

    envio: {
      cp: String,
      colonia: String,
      municipio: String,
      estado: String,
      calle: String,
      exterior: String,
      interior: String,
      nameRecibe: String
    },

    factura: {
      cp: String,
      colonia: String,
      municipio: String,
      estado: String,
      calle: String,
      exterior: String,
      interior: String
    },

    pago: {
      metodo: {
        type: String,
        required: true,
        default: 'card'
      },
      referencia:{
        type:String,        
      }
    },

    

    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Order', orderSchema)
