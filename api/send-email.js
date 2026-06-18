const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { to, subject, body, replyTo } = req.body;
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'consulenza@soloconsulting.org',
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    await transporter.sendMail({
      from: '"Caterina Madeddu — Solo Consulting" <consulenza@soloconsulting.org>',
      to,
      subject,
      html: body,
      replyTo: replyTo || 'consulenza@soloconsulting.org'
    });
    
    res.json({success: true});
  } catch(err) {
    res.status(500).json({success: false, error: err.message});
  }
};
