

const pagarConClip = async (req, res) => {
  try {
    const {
      cardToken,
      amount,
      description,
      email,
      phone,
      
    } = req.body;


    if (!cardToken || !amount) {
      return res.status(400).json({
        ok: false,
        message: 'cardToken y amount son obligatorios'
      });
    }

  //  const amountCentavos = Math.round(Number(amount) * 100);
    const bodyData = {
      amount: Number(amount) || 1,
      currency: 'MXN',
      description: description || 'Pago',
      payment_method: {
        token: cardToken
      },
      customer: {
        email,
        phone
      }
    };

   

    const response = await fetch('https://api.payclip.com/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ec4e3d33-820f-4922-8037-cf91204b6b63`,        
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(bodyData)
    });

    console.log('body', bodyData)

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data
      });
    }

    return res.json({
      ok: true,
      payment: data
    });

  } catch (error) {
    console.error('Error en pago Clip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = pagarConClip;
