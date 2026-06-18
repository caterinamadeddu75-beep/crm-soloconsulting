const Imap = require('imap');
const { simpleParser } = require('mailparser');

exports.handler = async (event) => {
  return new Promise((resolve) => {
    const imap = new Imap({
      user: 'consulenza@soloconsulting.org',
      password: process.env.EMAIL_PASSWORD,
      host: 'imap.hostinger.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
          return;
        }

        imap.search(['ALL'], (err, results) => {
          if (err || !results.length) {
            imap.end();
            resolve({ statusCode: 200, body: JSON.stringify([]) });
            return;
          }

          const recent = results.slice(-50);
          const fetch = imap.fetch(recent, { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (!err) {
                  emails.push({
                    from: parsed.from?.text || '',
                    to: parsed.to?.text || '',
                    subject: parsed.subject || '',
                    date: parsed.date || '',
                    text: parsed.text || '',
                    html: parsed.html || ''
                  });
                }
              });
            });
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('end', () => {
      resolve({
        statusCode: 200,
        body: JSON.stringify(emails)
      });
    });

    imap.once('error', (err) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
    });

    imap.connect();
  });
};
