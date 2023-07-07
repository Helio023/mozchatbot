const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const pug = require('pug');
const { convert } = require('html-to-text');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY_HIO,
    domain: process.env.MAILGUN_DOMAIN_HIO,
  },
};

 class Email {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from = '<hiotech.co>';
  }

  newTransport() {
    return nodemailer.createTransport(mailgun(auth));
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      username: this.username,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send('forgot', 'Token para redefinir senha <válido por 10 minutos>');
  }
};

module.exports =  Email 