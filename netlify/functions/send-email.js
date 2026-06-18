const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { to, subject, body, replyTo } = JSON.parse(event.body);

  const transporter = nodemailer.createTransporter({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'consulenza@soloconsulting.org',
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: '"Caterina Madeddu — Solo Consulting" <consulenza@soloconsulting.org>',
      to,
      subject,
      html: body,
      replyTo: replyTo || 'consulenza@soloconsulting.org'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
