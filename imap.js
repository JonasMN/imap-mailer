const Imap = require('imap');
const MailParser = require('mailparser').MailParser;


// Configuración de conexión IMAP
const imapConfig = {
  user: 'user_email@gmail.com',
  password: 'password',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false
}
};

// Crear una nueva instancia de cliente IMAP
const imap = new Imap(imapConfig);

// Evento de conexión establecida
imap.once('ready', () => {
  console.log('Conexión IMAP exitosa');

  // Abrir el buzón de correo
  imap.openBox('INBOX', false, (err, mailbox) => {
    if (err) {
      console.error('Error al abrir el buzón:', err);
      return;
    }

    // Buscar el último mensaje de correo electrónico
    imap.search(['ALL'], (searchErr, results) => {
      if (searchErr) {
        console.error('Error al buscar correos electrónicos:', searchErr);
        return;
      }

      // Ordenar los resultados para obtener el último mensaje
      results.sort((a, b) => b - a);
      const lastMessage = results.slice(0, 1); // Obtener el último mensaje

      const fetch = imap.fetch(lastMessage, { bodies: '' });

      // Procesar el correo electrónico
      fetch.on('message', (msg) => {
        const mailParser = new MailParser();

        msg.on('body', (stream) => {
          stream.pipe(mailParser);
        });

        // Obtener los campos deseados del correo electrónico analizado
        mailParser.on('headers', (headers) => {
          console.log('Remitente:', headers.get('from'));
          console.log('Asunto:', headers.get('subject'));
        });

        mailParser.on('data', (data) => {
          if (data.type === 'text') {
            console.log('Cuerpo del mensaje:', data.text);
          }
        });
      });

      fetch.on('end', () => {
        console.log('Proceso de lectura de correos electrónicos finalizado.');
        imap.end(); // Cerrar la conexión IMAP
      });
    });
  });
});

// Evento de error en la conexión
imap.once('error', (err) => {
  console.error('Error de conexión IMAP:', err);
});

imap.once('end', () => {
  console.log('Conexión IMAP cerrada');
});

// Establecer la conexión IMAP
imap.connect();
