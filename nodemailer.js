const nodemailer = require('nodemailer');

// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'user_email@gmail.com',
    pass: 'password',
  },
});

// Detalles del correo electrónico
const mailOptions = {
  from: 'user_email@gmail.com',
  to: 'user_email@gmail.com',
  subject: 'Asunto prueba',
  text: 'Prueba de envio desde la app',
};

// Enviar el correo electrónico
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar el correo electrónico:', error);
  } else {
    console.log('Correo electrónico enviado:', info.response);
  }
});
