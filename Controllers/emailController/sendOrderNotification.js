const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderNotification = async (pedido) => {
  try {
    // const {
    //   numeroPedido,
    //   nombre,
    //   telefono,
    //   total,
    //   cantidad,
    //   tipoPago,
    //   fechaEntrega,
    //   direcciones = {}
    // } = pedido;

    const { personal, envio, factura, pago, total, cantidad } = pedido;

    // Extraemos correctamente envio y facturacion
    // const envio = direcciones.envio || {};
    // const facturacion = direcciones.facturacion || {};

    // Mensaje condicional según tipo de pago
    let mensajePago = "";
    if (pago.metodo === "spei") {
      mensajePago =
        "Recibimos tu comprobante de pago SPEI. Tu pedido será procesado una vez confirmado el pago.";
    } else if (pago.metodo === "card") {
      mensajePago =
        "Tu pago con tarjeta ha sido aprobado exitosamente. Tu pedido está confirmado.";
    }

    const htmlMessage = `
      <html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Confirmación de pedido</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f6f6f6;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #222;
            font-size: 22px;
        }

        h2 {
            margin-top: 25px;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }

        p {
            margin: 6px 0;
            color: #444;
            font-size: 14px;
        }

        .highlight {
            font-weight: bold;
            color: #000;
        }

        .status {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>Recibimos tu pedido 🎉</h1>

        <p><strong>Pedido #:</strong> {{NUMERO_PEDIDO}}</p>

        <img src="https://res.cloudinary.com/dtype2a4n/image/upload/v1769680520/541150910_1201723378666298_34892727955724004_n_ukr8ea.jpg" alt="JUGUETRON"
            style="max-width:600px; margin-bottom:15px; border: 1px solid #5050504f; border-radius: 8px; " />
            <h5 style="color: #444; text-transform: capitalize;" >PREVENTA LEGO Editions Sports Trofeo Copa Mundial de
                          la FIFA 43020</h5>
            <p><strong>Cantidad:</strong> {{CANTIDAD}}</p>
            <p><strong>Total:</strong> $ {{TOTAL}} MXN</p>

        
        <p><strong>Cliente:</strong> {{NOMBRE_CLIENTE}}</p>
        <p><strong>Teléfono:</strong> {{TELEFONO_CLIENTE}}</p>
        
        <p><strong>Método de pago:</strong> {{METODO_PAGO}}</p>

        <div class="status">
            <p>{{MENSAJE_PAGO}}</p>
        </div>

        <h2 style="color: #444; font-size: 14px;">Datos de envío</h2>
        <p style="color: #444; font-size: 12px;">
            {{ENVIO_CALLE}} ext: {{ENVIO_EXTERIOR}} int: {{ENVIO_INTERIOR}}<br />
            {{ENVIO_COLONIA}}, {{ENVIO_MUNICIPIO}}, {{ENVIO_ESTADO}}<br />
            CP: {{ENVIO_CP}} <br/>
            Persona quien reibe: {{PERSONA_RECIBE}}
        </p>
        

        <h2 style="color: #444; font-size: 14px;">Datos de facturación</h2>
        <p style="color: #444; font-size: 12px;">
            {{FACT_CALLE}} ext: {{FACT_EXTERIOR}} int: {{FACT_INTERIOR}}<br />
            {{FACT_COLONIA}}, {{FACT_MUNICIPIO}}, {{FACT_ESTADO}}<br />
            CP: {{FACT_CP}}
        </p>
        

        <p class="highlight">
            {{FECHA_ENTREGA}}
        </p>
        <p style="color: #6b6b6b; margin-top:1rem; font-size: 12px; text-align: center; margin-top: 8px;">DISTRIBUIDORA JUGUETRON, es responsable del tratamiento y protección de tus datos personales. 
            La información recabada se utilizará únicamente para la gestión de tus órdenes, atención a clientes y envío de información 
            relevante sobre servicios y eventos.  <br>
            DISTRIBUIDORA JUGUETRON. © 2025 | Todos los derechos reservados.</p>
    </div>

</body>

</html>
    `;
    let finalHtml = htmlMessage
      .replace("{{NUMERO_PEDIDO}}", pago.referencia)
      .replace("{{NOMBRE_CLIENTE}}", personal.nombre || personal.email)
      .replace("{{TELEFONO_CLIENTE}}", personal.telefono || "No proporcionado")
      .replace("{{TOTAL}}", total.toFixed(2))
      .replace("{{CANTIDAD}}", cantidad)
      .replace("{{METODO_PAGO}}", pago.metodo.toUpperCase())
      .replace("{{MENSAJE_PAGO}}", mensajePago)

      // ENVÍO
      .replace("{{ENVIO_CALLE}}", envio?.calle || "")
      .replace("{{ENVIO_EXTERIOR}}", envio?.exterior || "")
      .replace("{{ENVIO_INTERIOR}}", envio?.interior || "")
      .replace("{{ENVIO_COLONIA}}", envio?.colonia || "")
      .replace("{{ENVIO_MUNICIPIO}}", envio?.municipio || "")
      .replace("{{ENVIO_ESTADO}}", envio?.estado || "")
      .replace("{{ENVIO_CP}}", envio?.cp || "")
        .replace('{{PERSONA_RECIBE}}', envio?.nameRecibe || personal.nombre)

      // FACTURACIÓN
      .replace("{{FACT_CALLE}}", factura?.calle || envio?.calle)
      .replace("{{FACT_EXTERIOR}}", factura?.exterior || envio?.exterior)
      .replace("{{FACT_INTERIOR}}", factura?.interior || envio?.interior)
      .replace("{{FACT_COLONIA}}", factura?.colonia || envio?.colonia)
      .replace("{{FACT_MUNICIPIO}}", factura?.municipio || envio?.municipio)
      .replace("{{FACT_ESTADO}}", factura?.estado || envio?.municipio)
      .replace("{{FACT_CP}}", factura?.cp || envio?.cp)
      //   .replace('{{FACT_TELEFONO}}', factura?.telefono || '')

      .replace("{{FECHA_ENTREGA}}", "Entrega Estimada: Marzo 2026");

    const msg = {
      to: personal.email,
      from: {
        email: process.env.EMAIL_FROM, // correo verificado en SendGrid
        name: "Juguetron Online", // nombre que verá el cliente
      },
      subject: `DISTRIBUIDORA JUGUETRON #${pago.referencia}`,
      html: finalHtml,
    };

    await sgMail.send(msg);
    // console.log('Correo de notificación enviado a', correoUsuario);
  } catch (error) {
    console.error("Error SendGrid:", error);
  }
};

module.exports = sendOrderNotification;
